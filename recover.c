#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

typedef uint8_t BYTE;

int main(int argc, char *argv[])
{
    if (argc != 2)
    {
        printf("Usage: ./recover IMAGE\n");
        return 1;
    }

    FILE *input = fopen(argv[1], "r");
    if (input == NULL)
    {
        printf("Could not open file.\n");
        return 1;
    }
    BYTE buffer[512];
    int count = 0;
    FILE *output = NULL;
    char filename[8];
    while (fread(buffer, sizeof(BYTE), 512, input) == 512)
    {
        if (buffer[0] == 0xff && buffer[1] == 0xd8 && buffer[2] == 0xff && (buffer[3] & 0xf0) == 0xe0)
        {
            if (count != 0)
            {
                fclose(output);
            }
            sprintf(filename, "%03i.jpg", count);
            output = fopen(filename, "w");
            fwrite(buffer, sizeof(BYTE), 512, output);
            count++;
        }
        else if (count > 0)
        {
            fwrite(buffer, sizeof(BYTE), 512, output);
        }
    }
    fclose(input);
    fclose(output);
    return 0;
}