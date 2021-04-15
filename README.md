# Issue assigner

Assign issues to the last user that changed that line.

## Create a workflow:
```yml
name: "Issue assigner"

on: [issues, issue_comment]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: Bugheist/issue-assigner@master
      with:
        GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}"

