import os

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.security import check_password_hash, generate_password_hash
import datetime

from helpers import apology, login_required, lookup, usd

# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Custom filter
app.jinja_env.filters["usd"] = usd

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///finance.db")

# Make sure API key is set
# pk_d91e9e150008408dbb38e49001f98e79
if not os.environ.get("API_KEY"):
    raise RuntimeError("API_KEY not set")


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
@login_required
def index():
    """Show portfolio of stocks"""
    id = session["user_id"][0]["id"]
    transactions = db.execute("SELECT * FROM transactions WHERE id = ?", id)
    cash = db.execute("SELECT cash FROM users WHERE id = ?", id)[0]["cash"]

    totalTotal = db.execute("SELECT SUM(total) FROM transactions WHERE id = ?", id)[0]["SUM(total)"]
    if totalTotal is None:
        totalTotal = 0
    totalTotal += cash

    return render_template("index.html", transactions=transactions, cash=cash, totalTotal=totalTotal)


@app.route("/buy", methods=["GET", "POST"])
@login_required
def buy():
    """Buy shares of stock"""
    if request.method == "POST":
        symbol = request.form.get("symbol").upper()
        quote = lookup(symbol)
        if quote == None:
            return apology("Stock symbol does not exist")
        shares = request.form.get("shares")

        if not shares.isnumeric() or float(shares) < 0 or not float(shares).is_integer():
            return apology("Must be positive integer number of shares")
        shares = int(shares)

        price = float(quote["price"])
        id = session["user_id"][0]["id"]
        cash = db.execute("SELECT cash FROM users WHERE id = ?", id)[0]["cash"]
        if cash < price * shares:
            return apology("You don't have enough cash")

        db.execute("INSERT INTO history (id, symbol, shares, price, time) VALUES (?, ?, ?, ?, ?)", id, symbol, shares, price, datetime.datetime.now())

        symbols = db.execute("SELECT symbol FROM transactions WHERE id=?", id)
        for i in range(len(symbols)):
            if symbol == symbols[i]["symbol"]:
                oldShares = db.execute("SELECT shares FROM transactions WHERE id=? AND symbol=?", id, symbol)[0]["shares"]
                db.execute("UPDATE transactions SET shares = ? WHERE id = ?", shares+oldShares, id)
                db.execute("UPDATE transactions SET price = ? WHERE id = ?", price, id)
                db.execute("UPDATE transactions SET total = ? WHERE id = ?", (shares+oldShares) * price, id)
                db.execute("UPDATE users SET cash = ? WHERE id = ?", cash-(price*shares), id)
                flash("Bought!")
                return redirect("/")
        db.execute("INSERT INTO transactions (id, symbol, shares, price, total, time, name) VALUES (?, ?, ?, ?, ?, ?, ?)", id, quote["symbol"], shares, price, shares * price, datetime.datetime.now(), quote["name"])
        db.execute("UPDATE users SET cash = ? WHERE id = ?", cash-(price*shares), id)
        flash("Bought!")
        return redirect("/")
    else:
        return render_template("buy.html")


@app.route("/history")
@login_required
def history():
    """Show history of transactions"""
    id = session["user_id"][0]["id"]
    history = db.execute("SELECT * FROM history WHERE id=?", id)
    return render_template("history.html", history=history)


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        # Ensure username was submitted
        if not request.form.get("username"):
            return apology("must provide username", 403)

        # Ensure password was submitted
        elif not request.form.get("password"):
            return apology("must provide password", 403)

        # Query database for username
        rows = db.execute("SELECT * FROM users WHERE username = ?", request.form.get("username"))

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(rows[0]["hash"], request.form.get("password")):
            return apology("invalid username and/or password", 403)

        # Remember which user has logged in
        session["user_id"] = rows

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")


@app.route("/quote", methods=["GET", "POST"])
@login_required
def quote():
    """Get stock quote."""
    if request.method == "POST":
        symbol = request.form.get("symbol")
        quote = lookup(symbol)
        if quote == None:
            return apology("Stock symbol does not exist")
        return render_template("quoted.html", name=quote["name"], price=quote["price"], symbol=quote["symbol"])
    else:
        return render_template("quote.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        confirmation = request.form.get("confirmation")

        if not username:
            return apology("Blank username")
        if not password:
            return apology("Blank password")
        if not confirmation:
            return apology("Blank password verification")

        if password != confirmation:
            return apology("Password does not match password verification")

        hash = generate_password_hash(password)
        try:
            db.execute("INSERT INTO users(username, hash) VALUES (?, ?)", username, hash)
        except:
            return apology("Username already exists")
        session["user_id"] = db.execute("SELECT id FROM users WHERE username = ?", username)
        flash("Registered!")
        return redirect("/")

    else:
        return render_template("register.html")


@app.route("/sell", methods=["GET", "POST"])
@login_required
def sell():
    """Sell shares of stock"""
    if request.method == "POST":
        symbol = request.form.get("symbol")
        shares = int(request.form.get("shares"))
        if not symbol:
            return apology("Blank symbol")
        quote = lookup(symbol)
        if quote == None:
            return apology("Stock symbol does not exist")
        if shares < 0:
            return apology("Must not be negative shares")
        value = shares * quote["price"]

        id = session["user_id"][0]["id"]
        cash = db.execute("SELECT cash FROM users WHERE id = ?", id)[0]["cash"]

        current_shares = db.execute("SELECT shares FROM transactions WHERE id = ? AND symbol = ? GROUP BY symbol", id, symbol)[0]["shares"]
        if shares > current_shares:
            return apology("You do not have enough shares")

        db.execute("INSERT INTO history (id, symbol, shares, price, time) VALUES (?, ?, ?, ?, ?)", id, symbol, shares*-1, quote["price"], datetime.datetime.now())

        symbols = db.execute("SELECT symbol FROM transactions WHERE id=?", id)
        for i in range(len(symbols)):
            if symbol == symbols[i]["symbol"]:
                oldShares = db.execute("SELECT shares FROM transactions WHERE id=? AND symbol=?", id, symbol)[0]["shares"]
                db.execute("UPDATE transactions SET shares = ? WHERE id = ?", oldShares-shares, id)
                db.execute("UPDATE transactions SET price = ? WHERE id = ?", quote["price"], id)
                db.execute("UPDATE transactions SET total = ? WHERE id = ?", (oldShares-shares) * quote["price"], id)
                db.execute("UPDATE users SET cash = ? WHERE id = ?", cash+value, id)
                flash("Sold!")
                return redirect("/")

        return apology("You do not own any shares of that stock")
    else:
        id = session["user_id"][0]["id"]
        symbols = db.execute("SELECT symbol FROM transactions WHERE id = ? GROUP BY symbol", id)
        return render_template("sell.html", symbols = [row["symbol"] for row in symbols])
