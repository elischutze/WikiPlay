import re
import sys

## TODO: write script to save headers
input = sys.argv[1]
output = sys.argv[2]
count = 0
insertinto = re.compile("^INSERT")
with open(output,'w') as r:
    none = 0

def main():
    count = 0
    with open(input,'r') as f:
        for line in f:
            #print(insertinto.match(line))
            if(insertinto.match(line)):
                currLine = f.readline()
                print(currLine[:10])
                currLine = currLine.split("VALUES (")[1]
                currLine = process_stripped_line(currLine[:-2])

                with open(output,'a') as r:
                    r.write(currLine)
                    count+=1
    print(count)
            #else:
            #    continue
        # while(not insertinto.match(f.readline())):

        # if insertinto.match(f.readline())
        # currLine = currLine.split("VALUES (")[1]
        # currLine = currLine[:-2].split("),(")
        #print(currLine,"\n", count)

def process_stripped_line(line):
    global count
    split = line.split("),(")
    count += len(split)
    return "\n".join(split)




main()


