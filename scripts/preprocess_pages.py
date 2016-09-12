##NOTE:most recent error is -->  unicode error 'utf-8' codec can't decode byte 0xe6 in position 6923: invalid continuation byte

import re
import sys
import csv

## input and output file
input = sys.argv[1]
output = sys.argv[2]

## Pattern to match start of INSERT statement in sql file
insertinto = re.compile("^INSERT INTO")

#initialize the output file (wipe before start )
with open(output,'w') as r:
    none = 0

def main():
    count = 0
    with open(input,'r') as f:
        for line in f:
            if(insertinto.match(line)):
                currLine = f.readline()
                print("Read a line, it starts with:",currLine[:10])
                currLine = currLine.split("VALUES (")[1]
                lines = split_lines(currLine)
                with open(output,'a') as r:
                    for row in lines:
                        r.write(row+"\n")
                        count+=1
            else:
                continue
    print(count)

def split_lines(line):
    line = line[:-3]
    rows = line.split("),(")
    mapped_rows = map(addPipeDelimiters,iter(filter(mainNamespace,iter(rows))))
    return list(mapped_rows)
"""
We add pipe '|' delimiters to avoid conflicts with commas inside our fields
"""

def addPipeDelimiters(line):
    row = line.split(",", maxsplit=2)
    row[2] = row[2].split("','")[0]+"'"
    return "|"+"|,|".join(row)+"|"


if __name__ == "__main__":
    main()
