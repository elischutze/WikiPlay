import sys

with open(sys.argv[1],'r') as f:
    for line in f:
        new = line.replace("\"","\\\"")
        with open(sys.argv[2],'a') as g:
            g.write(new)
