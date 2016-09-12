"""
This module gets only the headers from a Wikipedia SQL-formatted dump
Usage: python3 getHeaders.py [SQL DUMP FILENAME] [OUTPUT FILENAME]
"""
import re
import sys

input = sys.argv[1]
output = sys.argv[2]

print("input:",input)
print("output:",output)

## RegEx Expressions ##
startpattern = re.compile('^CREATE TABLE')
endpattern = re.compile('^[ ]*`')

## init List to store the headers
headers = []

#Read headers, save locally
with open(input,'r') as file:
    for line in file:
        if(not startpattern.match(line)):
            file.readline()
            continue
        else:
            currLine = file.readline()
            print("current Line: ",currLine)
            while(endpattern.match(currLine)):
                headers.append(currLine.split('`')[1])
                currLine = file.readline()
            break
print("Headers: ",headers)

#Write headers to file
with open(output,'a') as file:
    file.write(",".join(headers))
