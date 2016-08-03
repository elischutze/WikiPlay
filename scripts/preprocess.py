##NOTE:most recent error is -->  unicode error 'utf-8' codec can't decode byte 0xe6 in position 6923: invalid continuation byte

import re
import sys
import csv

# NUM_HEADERS = sys.argv[3]

## input and output file
input = sys.argv[1]
output = sys.argv[2]

## Pattern to match start of INSERT statement in sql file
insertinto = re.compile("^INSERT")

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
                # print(currLine)
                with open(output,'a') as r:
                    # csvWriter = csv.writer(r,delimiter=',',quotechar='|')
                    for row in lines:
                        r.write(row+"\n")
                        count+=1
                    # count+=1
            else:
                continue
    print(count)
            #else:
            #    continue
        # while(not insertinto.match(f.readline())):
        # if insertinto.match(f.readline())
        # currLine = currLine.split("VALUES (")[1]
        # currLine = currLine[:-2].split("),(")
        #print(currLine,"\n", count)
def split_lines(line):
    #remove trailing semicolon and parens before split on '),('
    line = line[:-3] #));
    # print(line)
    rows = line.split("),(") #rows = [line,line,line]
    mapped_rows = map(addPipeDelimiters,iter(rows))
    # count += len(rows)
    # print(rows[0])
    # print(list(mapped_rows)[:2])
    return list(mapped_rows)

def addPipeDelimiters(line):
    row = line.split(",", maxsplit=2)
    row[2] = "".join(row[2].split(",")[:-1])
    return "|"+"|,|".join(row)+"|"
    # print(rows)


main()


