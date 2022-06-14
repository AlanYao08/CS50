#include "helpers.h"
#include <math.h>

// Convert image to grayscale
void grayscale(int height, int width, RGBTRIPLE image[height][width])
{
    for (int i=0; i<height; i++)
    {
        for (int j=0; j<width; j++)
        {
            int average = round((image[i][j].rgbtBlue + image[i][j].rgbtGreen + image[i][j].rgbtRed)/3.);
            image[i][j].rgbtBlue = average;
            image[i][j].rgbtGreen = average;
            image[i][j].rgbtRed = average;
        }
    }
}

// Reflect image horizontally
void reflect(int height, int width, RGBTRIPLE image[height][width])
{
    for (int i=0; i<height; i++)
    {
        for (int j=0; j<width/2; j++)
        {
            int oldBlue = image[i][j].rgbtBlue;
            int oldGreen = image[i][j].rgbtGreen;
            int oldRed = image[i][j].rgbtRed;
            image[i][j].rgbtBlue = image[i][width-j-1].rgbtBlue;
            image[i][j].rgbtGreen = image[i][width-j-1].rgbtGreen;
            image[i][j].rgbtRed = image[i][width-j-1].rgbtRed;
            image[i][width-j-1].rgbtBlue = oldBlue;
            image[i][width-j-1].rgbtGreen = oldGreen;
            image[i][width-j-1].rgbtRed = oldRed;
        }
    }
}

// Blur image
void blur(int height, int width, RGBTRIPLE image[height][width])
{
    for (int i=0; i<height; i++)
    {
        for (int j=0; j<width; j++)
        {
            int count = 1;
            int sumBlue = image[i][j].rgbtBlue;
            int sumGreen = image[i][j].rgbtGreen;
            int sumRed = image[i][j].rgbtRed;
            if (i != 0)
            {
                count++;
                sumBlue += image[i-1][j].rgbtBlue;
                sumGreen += image[i-1][j].rgbtGreen;
                sumRed += image[i-1][j].rgbtRed;
                if (j != 0)
                {
                    count++;
                    sumBlue += image[i-1][j-1].rgbtBlue;
                    sumGreen += image[i-1][j-1].rgbtGreen;
                    sumRed += image[i-1][j-1].rgbtRed;
                }
                if (j != width-1)
                {
                    count++;
                    sumBlue += image[i-1][j+1].rgbtBlue;
                    sumGreen += image[i-1][j+1].rgbtGreen;
                    sumRed += image[i-1][j+1].rgbtRed;
                }
            }
            if (i != height-1)
            {
                count++;
                sumBlue += image[i+1][j].rgbtBlue;
                sumGreen += image[i+1][j].rgbtGreen;
                sumRed += image[i+1][j].rgbtRed;
                if (j != 0)
                {
                    count++;
                    sumBlue += image[i+1][j-1].rgbtBlue;
                    sumGreen += image[i+1][j-1].rgbtGreen;
                    sumRed += image[i+1][j-1].rgbtRed;
                }
                if (j != width-1)
                {
                    count++;
                    sumBlue += image[i+1][j+1].rgbtBlue;
                    sumGreen += image[i+1][j+1].rgbtGreen;
                    sumRed += image[i+1][j+1].rgbtRed;
                }
            }
            if (j != 0)
            {
                count++;
                sumBlue += image[i][j-1].rgbtBlue;
                sumGreen += image[i][j-1].rgbtGreen;
                sumRed += image[i][j-1].rgbtRed;
            }
            if (j != width-1)
            {
                count++;
                sumBlue += image[i][j+1].rgbtBlue;
                sumGreen += image[i][j+1].rgbtGreen;
                sumRed += image[i][j+1].rgbtRed;
            }
            image[i][j].rgbtBlue = round((float) sumBlue/count);
            image[i][j].rgbtGreen = round((float) sumGreen/count);
            image[i][j].rgbtRed = round((float) sumRed/count);
        }
    }
}

// Detect edges
void edges(int height, int width, RGBTRIPLE image[height][width])
{
    for (int i=0; i<height; i++)
    {
        for (int j=0; j<width; j++)
        {
            int sumBlueX = 0;
            int sumBlueY = 0;
            int sumGreenX = 0;
            int sumGreenY = 0;
            int sumRedX = 0;
            int sumRedY = 0;
            if (i != 0)
            {
                sumBlueY += -2 * image[i-1][j].rgbtBlue;
                sumGreenY += -2 * image[i-1][j].rgbtGreen;
                sumRedY += -2 * image[i-1][j].rgbtRed;
                if (j != 0)
                {
                    sumBlueX += -1 * image[i-1][j-1].rgbtBlue;
                    sumGreenX += -1 * image[i-1][j-1].rgbtGreen;
                    sumRedX += -1 * image[i-1][j-1].rgbtRed;
                    sumBlueY += -1 * image[i-1][j-1].rgbtBlue;
                    sumGreenY += -1 * image[i-1][j-1].rgbtGreen;
                    sumRedY += -1 * image[i-1][j-1].rgbtRed;
                }
                if (j != width-1)
                {
                    sumBlueX += image[i-1][j+1].rgbtBlue;
                    sumGreenX += image[i-1][j+1].rgbtGreen;
                    sumRedX += image[i-1][j+1].rgbtRed;
                    sumBlueY += -1 * image[i-1][j+1].rgbtBlue;
                    sumGreenY += -1 * image[i-1][j+1].rgbtGreen;
                    sumRedY += -1 * image[i-1][j+1].rgbtRed;
                }
            }
            if (i != height-1)
            {
                sumBlueY += 2 * image[i+1][j].rgbtBlue;
                sumGreenY += 2 * image[i+1][j].rgbtGreen;
                sumRedY += 2 * image[i+1][j].rgbtRed;
                if (j != 0)
                {
                    sumBlueX += -1 * image[i+1][j-1].rgbtBlue;
                    sumGreenX += -1 * image[i+1][j-1].rgbtGreen;
                    sumRedX += -1 * image[i+1][j-1].rgbtRed;
                    sumBlueY += image[i+1][j-1].rgbtBlue;
                    sumGreenY += image[i+1][j-1].rgbtGreen;
                    sumRedY += image[i+1][j-1].rgbtRed;
                }
                if (j != width-1)
                {
                    sumBlueX += image[i+1][j+1].rgbtBlue;
                    sumGreenX += image[i+1][j+1].rgbtGreen;
                    sumRedX += image[i+1][j+1].rgbtRed;
                    sumBlueY += image[i+1][j+1].rgbtBlue;
                    sumGreenY += image[i+1][j+1].rgbtGreen;
                    sumRedY += image[i+1][j+1].rgbtRed;
                }
            }
            if (j != 0)
            {
                sumBlueX += -2 * image[i][j-1].rgbtBlue;
                sumGreenX += -2 * image[i][j-1].rgbtGreen;
                sumRedX += -2 * image[i][j-1].rgbtRed;
            }
            if (j != width-1)
            {
                sumBlueX += 2 * image[i][j+1].rgbtBlue;
                sumGreenX += 2 * image[i][j+1].rgbtGreen;
                sumRedX += 2 * image[i][j+1].rgbtRed;
            }
            image[i][j].rgbtBlue = round(sqrt(pow(sumBlueX, 2)) + pow(sumBlueY, 2));
            image[i][j].rgbtGreen = round(sqrt(pow(sumGreenX, 2)) + pow(sumGreenY, 2));
            image[i][j].rgbtRed = round(sqrt(pow(sumRedX, 2)) + pow(sumRedY, 2));
        }
    }
}