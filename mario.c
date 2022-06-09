#include <cs50.h>
#include <stdio.h>

int main(void)
{
    int height;
    do
    {
        height = get_int("Height: ");
    }
    while (height < 1 || height > 8);

    for (int gap = height - 1; gap >= 0; gap--)
    {
        for (int i = 0; i < gap; i++)
        {
            printf(" ");
        }
        for (int j = 0; j < height - gap; j++)
        {
            printf("#");
        }
        printf("  ");
        for (int k = 0; k < height - gap; k++)
        {
            printf("#");
        }
        printf("\n");
    }
}