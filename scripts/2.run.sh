#!/usr/bin/env bash
set -e

echo \$CONTRACT is $CONTRACT
echo \$OWNER is $OWNER

# Create
near call $CONTRACT Create --amount 5 --account_id $OWNER

# Join
near call $CONTRACT Predict '{"_predictionID":4286537475,"_guess1":1,"_guess2":1}' --amount 1 --account_id hrs025.testnet

# End
near call $CONTRACT End '{"_predictionID":4286537475}' --account_id $OWNER