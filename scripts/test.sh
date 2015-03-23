#!/bin/bash

mocha -t 15000 server/test
mocha -t 15000 server/test/bte/user