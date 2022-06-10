#include <cs50.h>
#include <stdio.h>
#include <ctype.h>

int main(int argc, string argv[])
{
    if(argc != 2)
    {
        printf("Usage: ./substitution key\n");
        return 1;
    }
    string key = argv[1];
    int alphabet[26];
    int keyChange[26];
    int count = 0;
    int i=0;
    while(key[i] != '\0')
    {
        if (!isalpha(key[i]))
        {
            printf("Key must contain 26 different letters.\n");
            return 1;
        }
        if (isupper(key[i]))
        {
            key[i] = key[i] + 32;
        }
        if (alphabet[key[i]-97] == 1)
        {
            printf("Key must contain 26 different letters.\n");
            return 1;
        }
        alphabet[key[i]-97] = 1;
        keyChange[i] = (int) key[i]-97-i;
        i++;
        count++;
    }
    if (count != 26)
    {
        printf("Key must contain 26 characters.\n");
        return 1;
    }
    string plaintext = get_string("plaintext:  ");
    printf("ciphertext: ");
    int j=0;
    while(plaintext[j] != '\0')
    {
        if (islower(plaintext[j]))
        {
            printf("%c", plaintext[j] + keyChange[plaintext[j]-97]);
        }
        else if (isupper(plaintext[j]))
        {
            printf("%c", plaintext[j] + keyChange[plaintext[j]-65]);
        }
        else
        {
            printf("%c", plaintext[j]);
        }
        j++;
    }
    printf("\n");
    return 0;
}