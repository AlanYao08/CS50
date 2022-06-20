from cs50 import get_int

credit = get_int("Number: ")
parity = False
sum = 0
count = 0
while credit != 0:
    if credit > 9 and credit < 100:
        firstTwo = credit

    if parity == False:
        sum += credit % 10
    else:
        double = 2 * (credit % 10)
        sum += double // 10 + double % 10
    credit = credit // 10
    count += 1
    parity = not parity

if sum % 10 == 0:
    good = True
else:
    good = False

if good:
    if count == 15 and (firstTwo == 34 or firstTwo == 37):
        print("AMEX\n")
    elif count == 16 and firstTwo // 10 == 5 and firstTwo % 10 > 0 and firstTwo % 10 < 6:
        print("MASTERCARD\n")
    elif (count == 13 or count == 16) and firstTwo // 10 == 4:
        print("VISA\n")
    else:
        print("INVALID\n")
else:
    print("INVALID\n")