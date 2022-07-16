import os
import random
import re
import sys

DAMPING = 0.85
SAMPLES = 10000


def main():
    if len(sys.argv) != 2:
        sys.exit("Usage: python pagerank.py corpus")
    corpus = crawl(sys.argv[1])
    ranks = sample_pagerank(corpus, DAMPING, SAMPLES)
    print(f"PageRank Results from Sampling (n = {SAMPLES})")
    for page in sorted(ranks):
        print(f"  {page}: {ranks[page]:.4f}")
    ranks = iterate_pagerank(corpus, DAMPING)
    print(f"PageRank Results from Iteration")
    for page in sorted(ranks):
        print(f"  {page}: {ranks[page]:.4f}")


def crawl(directory):
    """
    Parse a directory of HTML pages and check for links to other pages.
    Return a dictionary where each key is a page, and values are
    a list of all other pages in the corpus that are linked to by the page.
    """
    pages = dict()

    # Extract all links from HTML files
    for filename in os.listdir(directory):
        if not filename.endswith(".html"):
            continue
        with open(os.path.join(directory, filename)) as f:
            contents = f.read()
            links = re.findall(r"<a\s+(?:[^>]*?)href=\"([^\"]*)\"", contents)
            pages[filename] = set(links) - {filename}

    # Only include links to other pages in the corpus
    for filename in pages:
        pages[filename] = set(
            link for link in pages[filename]
            if link in pages
        )

    return pages


def transition_model(corpus, page, damping_factor):
    """
    Return a probability distribution over which page to visit next,
    given a current page.

    With probability `damping_factor`, choose a link at random
    linked to by `page`. With probability `1 - damping_factor`, choose
    a link at random chosen from all pages in the corpus.
    """
    output = {}
    for link in corpus:
        output[link] = (1-damping_factor)/len(corpus)

    if len(corpus[page]) == 0:
        for link in corpus:
            output[link] += damping_factor/len(corpus)
    else:
        for link in corpus[page]:
            output[link] += damping_factor/len(corpus[page])

    return output


def sample_pagerank(corpus, damping_factor, n):
    """
    Return PageRank values for each page by sampling `n` pages
    according to transition model, starting with a page at random.

    Return a dictionary where keys are page names, and values are
    their estimated PageRank value (a value between 0 and 1). All
    PageRank values should sum to 1.
    """
    output = {}

    page = random.choice(list(corpus))
    if page in output:
        output[page] += 1
    else:
        output[page] = 1

    for i in range(n-1):
        model = transition_model(corpus, page, damping_factor)
        number = random.random()
        total = 0
        for link in model:
            if number < total + model[link]:
                page = link
                if page in output:
                    output[page] += 1
                else:
                    output[page] = 1
                break
            total += model[link]

    for page in output:
        output[page] = output[page] / n
    return output


def iterate_pagerank(corpus, damping_factor):
    """
    Return PageRank values for each page by iteratively updating
    PageRank values until convergence.

    Return a dictionary where keys are page names, and values are
    their estimated PageRank value (a value between 0 and 1). All
    PageRank values should sum to 1.
    """
    output = {}
    for page in corpus:
        output[page] = 1 / len(corpus)

    while True:
        again = False
        for page in output:
            original = output[page]

            rank = (1-damping_factor) / len(corpus)

            sum = 0
            for link in corpus:
                if page in corpus[link]:
                    sum += output[link] / len(corpus[link])
            sum *= damping_factor

            rank += sum
            output[page] = rank
            if abs(rank - original) > 0.001:
                again = True
        if again == False:
            break

    return output


if __name__ == "__main__":
    main()
