#include <cs50.h>
#include <stdio.h>

int main(void)
{
    long number = get_long("Number: ");

    int digits = 0;
    int sum = 0;
    int first;
    int second;
    bool everyOther = true;
    while (number > 0)
    {
        if (number < 100 && number > 9)
        {
            first = number / 10;
            second = number % 10;
        }
        if (everyOther)
        {
            sum += number % 10;
        }
        else
        {
            int timesTwo = (number % 10) * 2;
            sum += timesTwo % 10 + timesTwo / 10;
        }
        everyOther = !everyOther;
        digits++;
        number = number / 10;
    }
    if (sum % 10 == 0)
    {
        if (digits == 15 && first == 3 && (second == 4 || second == 7))
        {
            printf("AMEX\n");
        }
        else if (digits == 16 && first==5 && second>0 && second<6)
        {
            printf("MASTERCARD\n");
        }
        else if((digits==13 || digits==16) && first==4)
        {
            printf("VISA\n");
        }
        else
        {
            printf("INVALID\n");
        }
    }
    else
    {
        printf("INVALID\n");
    }
}