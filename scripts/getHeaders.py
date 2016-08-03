import re
import sys

input = sys.argv[1]
output = sys.argv[2]

print("input:",input)
print("output:",output)

startpattern = re.compile('^CREATE TABLE')
endpattern = re.compile('^[ ]*`')
headers = []

with open(input,'r') as file:
    for line in file:
        if(not startpattern.match(line)):
            # print("curr line:",line)
            file.readline()
            continue
        else:
            # file.readline()
            currLine = file.readline()
            print("currLine: ",currLine)
            while(endpattern.match(currLine)):
                headers.append(currLine.split('`')[1])
                currLine = file.readline()
            break
print("headers:",headers)
with open(output,'a') as file:
    file.write(",".join(headers))








