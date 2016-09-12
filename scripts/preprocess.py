"""
This module formats Wikipedia SQL-formatted dump into pipe-delimited CSV formats
for Neo4j import. Make sure to run 'addDelimiters' module before import.
Usage: python3 preprocess.py [SQL DUMP FILENAME] [OUTPUT FILENAME] [DUMP TYPE]

DUMP TYPE: use 'pagenames' for titles dump or 'pagelinks' for links dump

"""
import re
import sys
import csv

# Check that arguments are correct
if(not re.match("\.sql$",sys.argv[1])):
    raise ValueError("input file must be in sql format")
if(not sys.argv[3] == "pagelinks" and not sys.argv[3] == "pagenames"):
    raise ValueError("argument must only be 'pagelinks' or 'pagenames'")

## assign arguments to global variables
INPUT = sys.argv[1]
OUTPUT = sys.argv[2]
TYPE = sys.argv[3]

## Pattern to match start of INSERT statement in sql file
insertinto = re.compile("^INSERT INTO")

#initialize the OUTPUT file (wipe before start )
with open(OUTPUT,'w') as r:
    none = 0

def main():
    count = 0
    with open(INPUT,'r') as f:
        for line in f:
            if(insertinto.match(line)):
                currLine = f.readline()
                currLine = currLine.split("VALUES (")[1]
                lines = split_lines(currLine)
                with open(OUTPUT,'a') as r:
                    for row in lines:
                        r.write(row+"\n")
                        count+=1
            else:
                continue
    print(count)

"""
Makes each INSERT value entry it's own line
"""
def split_lines(line):
    line = line[:-3]
    rows = line.split("),(")
    if(TYPE=="pagelinks"):
        mapped_rows = map(addPipeDelimiters,iter(rows))
    elif(TYPE=="pagenames"):
        mapped_rows = map(addPipeDelimiters,iter(filter(mainNamespace,iter(rows))))
    return list(mapped_rows)

"""
We add pipe '|' delimiters to avoid conflicts with commas inside our fields
"""
def addPipeDelimiters(line):
    row = line.split(",", maxsplit=2)
    if(TYPE=="pagelinks"):
        row[2] = "".join(row[2].split(",")[:-1])
    elif(TYPE=="pagenames"):
        row[2] = row[2].split("','")[0]+"'"
    return "|"+"|,|".join(row)+"|"

"""
Check for main namespace 0
"""
def mainNamespace(line):
    row = line.split(",", maxsplit=2)
    return(row[1]=="0")

if __name__ == "__main__":
    main()
