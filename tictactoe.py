"""
Tic Tac Toe Player
"""

import math

X = "X"
O = "O"
EMPTY = None


def initial_state():
    """
    Returns starting state of the board.
    """
    return [[EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY]]


def player(board):
    """
    Returns player who has the next turn on a board.
    """
    xCount = 0
    oCount = 0
    for i in range(3):
        for j in range(3):
            if board[i][j] == X:
                xCount += 1
            elif board[i][j] == O:
                oCount += 1

    if xCount > oCount:
        return O
    else:
        return X


def actions(board):
    """
    Returns set of all possible actions (i, j) available on the board.
    """
    actions = set()
    for i in range(3):
        for j in range(3):
            if board[i][j] == EMPTY:
                actions.add((i, j))
    return actions


def result(board, action):
    """
    Returns the board that results from making move (i, j) on the board.
    """
    newBoard = [[EMPTY, EMPTY, EMPTY],
                [EMPTY, EMPTY, EMPTY],
                [EMPTY, EMPTY, EMPTY]]
    for i in range(3):
        for j in range(3):
            if (i, j) == action:
                if board[i][j] != None:
                    raise NameError('Invalid move')
                else:
                    newBoard[i][j] = player(board)
            else:
                newBoard[i][j] = board[i][j]
    return newBoard


def winner(board):
    """
    Returns the winner of the game, if there is one.
    """
    for i in range(3):
        if board[i][0] == board[i][1] and board[i][0] == board[i][2]:
            return board[i][0]
    for j in range(3):
        if board[0][j] == board[1][j] and board[0][j] == board[2][j]:
            return board[0][j]
    if board[0][0] == board[1][1] and board[0][0] == board[2][2]:
        return board[0][0]
    elif board[0][2] == board[1][1] and board[0][2] == board[2][0]:
        return board[0][2]
    else:
        return None


def terminal(board):
    """
    Returns True if game is over, False otherwise.
    """
    if winner(board) != None:
        return True
    filled = True
    for i in range(3):
        for j in range(3):
            if board[i][j] == None:
                filled = False
    if filled:
        return True
    else:
        return False


def utility(board):
    """
    Returns 1 if X has won the game, -1 if O has won, 0 otherwise.
    """
    if winner(board) == X:
        return 1
    elif winner(board) == O:
        return -1
    else:
        return 0


def minimax(board):
    """
    Returns the optimal action for the current player on the board.
    """
    if terminal(board):
        return None
    else:
        bestAction = (0, 0)
        if player(board) == X: # Maximize
            value = float('-inf')
            for action in actions(board):
                if minValue(result(board, action)) > value:
                    value = minValue(result(board, action))
                    bestAction = action
        else: # Minimize
            value = float('inf')
            for action in actions(board):
                if maxValue(result(board, action)) < value:
                    value = maxValue(result(board, action))
                    bestAction = action
        return bestAction


def maxValue(board):
    value = float('-inf')
    if terminal(board):
        return utility(board)
    for action in actions(board):
        value = max(value, minValue(result(board, action)))
    return value


def minValue(board):
    value = float('inf')
    if terminal(board):
        return utility(board)
    for action in actions(board):
        value = min(value, maxValue(result(board, action)))
    return value
