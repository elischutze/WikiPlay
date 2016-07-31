import re
import sys
import csv

# NUM_HEADERS = sys.argv[3]

## input and output file
input = sys.argv[1]
output = sys.argv[2]
count = 0


insertinto = re.compile("^INSERT")
with open(output,'w') as r:
    none = 0

def main():

    with open(input,'r') as f:
        for line in f:
            #print(insertinto.match(line))
            if(insertinto.match(line)):
                currLine = f.readline()
                print(currLine[:10])
                currLine = currLine.split("VALUES (")[1]
                currLine = process_stripped_line(currLine[:-2])

                with open(output,'a') as r:
                    # csvWriter = csv.writer(r,delimiter=',',quotechar='|')
                    for row in currLine:
                        r.write(row+"\n")
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

def process_stripped_line(line):
    global count, NUM_HEADERS

    rows = line[:-1].split("),(")
    count += len(rows)
    for i,row in enumerate(rows):
        row = row.split('\'')
        if(len(row)==3):
            rows[i] = "|"+row[0].replace(',',"|,|")+row[1]+row[2].replace(',',"|,|")+"|"
            # print(row)
        else:
            rows = "ERROR ERROR" + rows
    print(rows)
    return rows




main()


