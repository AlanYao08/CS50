import csv
import sys


def main():

    if len(sys.argv) != 3:
        sys.exit("Usage: python dna.py data.csv sequence.txt")

    # Read database file into a variable
    data = []
    with open(sys.argv[1], "r") as file:
        reader = csv.reader(file)
        first = next(reader)[1:]
        for person in reader:
            personDictionary = {}
            personDictionary["name"] = person[0]
            for sequence in range(0, len(first), 1):
                personDictionary[first[sequence]] = int(person[sequence + 1])
            data.append(personDictionary)

    # Read DNA sequence file into a variable
    with open(sys.argv[2], "r") as file:
        reader = csv.reader(file)
        DNA = next(reader)[0]

    # Find longest match of each STR in DNA sequence
    sequenceCount = []
    for sequence in first:
        sequenceCount.append(longest_match(DNA, sequence))

    # Check database for matching profiles
    for person in data:
        good = True
        for i in range(0, len(first), 1):
            if person[first[i]] != sequenceCount[i]:
                good = False
        if good == True:
            print(person["name"])
            return
    print("No match")


def longest_match(sequence, subsequence):
    """Returns length of longest run of subsequence in sequence."""

    # Initialize variables
    longest_run = 0
    subsequence_length = len(subsequence)
    sequence_length = len(sequence)

    # Check each character in sequence for most consecutive runs of subsequence
    for i in range(sequence_length):

        # Initialize count of consecutive runs
        count = 0

        # Check for a subsequence match in a "substring" (a subset of characters) within sequence
        # If a match, move substring to next potential match in sequence
        # Continue moving substring and checking for matches until out of consecutive matches
        while True:

            # Adjust substring start and end
            start = i + count * subsequence_length
            end = start + subsequence_length

            # If there is a match in the substring
            if sequence[start:end] == subsequence:
                count += 1

            # If there is no match in the substring
            else:
                break

        # Update most consecutive matches found
        longest_run = max(longest_run, count)

    # After checking for runs at each character in seqeuence, return longest run found
    return longest_run


main()
