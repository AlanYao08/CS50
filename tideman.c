#include <cs50.h>
#include <stdio.h>
#include <string.h>

// Max number of candidates
#define MAX 9

// preferences[i][j] is number of voters who prefer i over j
int preferences[MAX][MAX];

// locked[i][j] means i is locked in over j
bool locked[MAX][MAX];

// Each pair has a winner, loser
typedef struct
{
    int winner;
    int loser;
}
pair;

// Array of candidates
string candidates[MAX];
pair pairs[MAX * (MAX - 1) / 2];

int pair_count;
int candidate_count;

// Function prototypes
bool vote(int rank, string name, int ranks[]);
void record_preferences(int ranks[]);
void add_pairs(void);
void sort_pairs(void);
void lock_pairs(void);
void print_winner(void);

int main(int argc, string argv[])
{
    // Check for invalid usage
    if (argc < 2)
    {
        printf("Usage: tideman [candidate ...]\n");
        return 1;
    }

    // Populate array of candidates
    candidate_count = argc - 1;
    if (candidate_count > MAX)
    {
        printf("Maximum number of candidates is %i\n", MAX);
        return 2;
    }
    for (int i = 0; i < candidate_count; i++)
    {
        candidates[i] = argv[i + 1];
    }

    // Clear graph of locked in pairs
    for (int i = 0; i < candidate_count; i++)
    {
        for (int j = 0; j < candidate_count; j++)
        {
            locked[i][j] = false;
        }
    }

    pair_count = 0;
    int voter_count = get_int("Number of voters: ");

    // Query for votes
    for (int i = 0; i < voter_count; i++)
    {
        // ranks[i] is voter's ith preference
        int ranks[candidate_count];

        // Query for each rank
        for (int j = 0; j < candidate_count; j++)
        {
            string name = get_string("Rank %i: ", j + 1);

            if (!vote(j, name, ranks))
            {
                printf("Invalid vote.\n");
                return 3;
            }
        }

        record_preferences(ranks);

        printf("\n");
    }

    add_pairs();
    sort_pairs();
    lock_pairs();
    print_winner();
    return 0;
}

// Update ranks given a new vote
bool vote(int rank, string name, int ranks[])
{
    for (int i=0; i<candidate_count; i++)
    {
        if (strcmp(name, candidates[i]) == 0)
        {
            ranks[rank] = i;
            return true;
        }
    }
    return false;
}

// Update preferences given one voter's ranks
void record_preferences(int ranks[])
{
    for (int i=0; i<candidate_count-1; i++) {
        for (int j=i+1; j<candidate_count; j++) {
            preferences[ranks[i]][ranks[j]]++;
        }

    }
}

// Record pairs of candidates where one is preferred over the other
void add_pairs(void)
{
    pair_count = 0;
    for (int i=0; i<candidate_count; i++) {
        for (int j=0; j<candidate_count; j++) {
            if (preferences[i][j] > preferences[j][i])
            {
                pairs[pair_count].winner = i;
                pairs[pair_count].loser = j;
                pair_count++;
            }
        }
    }
}

// Sort pairs in decreasing order by strength of victory
void sort_pairs(void)
{
    for (int i=0; i<pair_count; i++) // Repeat i times to sort
    {
        int max_strength = 0;
        int pairIndex;
        for (int j=i; j<pair_count; j++) // Check which one is the strongest, ignore the first i pairs
        {
            if(preferences[pairs[j].winner][pairs[j].loser] > max_strength)
            {
                max_strength = preferences[pairs[j].winner][pairs[j].loser];
                pairIndex = j;
            }
        }
        // Switch position i and pairIndex
        int iWinner = pairs[i].winner;
        int iLoser = pairs[i].loser;
        pairs[i].winner = pairs[pairIndex].winner;
        pairs[i].loser = pairs[pairIndex].loser;
        pairs[pairIndex].winner = iWinner;
        pairs[pairIndex].loser = iLoser;
    }
}

// Lock pairs into the candidate graph in order, without creating cycles
void lock_pairs(void)
{
    for (int i=0; i<pair_count; i++)
    {
        int start = pairs[i].winner;
        int current = pairs[i].loser;
        bool add = true;
        for (int times=0; times<candidate_count; times++)
        {
            for (int j=0; j<candidate_count; j++)
            {
                if (locked[current][j])
                {
                    int next = j;
                    if (next == start) // Its a loop
                    {
                        add = false;
                    }
                    else
                    {
                        current = next;
                    }
                }
            }
        }
        if (add)
        {
            locked[pairs[i].winner][pairs[i].loser] = true;
        }
    }
}

// Print the winner of the election
void print_winner(void)
{
    for (int i=0; i<candidate_count; i++)
    {
        bool winner = true;
        for (int j=0; j<candidate_count; j++)
        {
            if (locked[j][i])
            {
                winner = false;
            }
        }
        if (winner)
        {
            printf("%s\n", candidates[i]);
        }
    }
}