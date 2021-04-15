"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new(P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }

        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }

        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
        for (var k in mod)
            if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
//const lodash_1 = __importDefault(require("lodash"));

function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = core.getInput('GITHUB_TOKEN', {
                required: true
            });

            if (github.context.payload.action &&
                !['created', 'opened', 'reopened'].includes(github.context.payload.action)) {
                console.log(`
        The status of the action is no applicable ${github.context.payload.action}
      `);
                return;
            }
            const issueInfo = getIssueInfo();
            if (!issueInfo) {
                console.log('Could not get the issue number from context, exiting');
                return;
            }
            const {
                issueNodeId,
                body,
                userId
            } = issueInfo;
            if (!body) {
                console.log('Could not get the body of the issue, exiting');
                return;
            }

            const client = new github.GitHub(token);

            if (body.includes("assign to me")) {
                yield addAssigneesToAssignable(client, userId, issueNodeId);
            }


        } catch (error) {
            core.error(error);
            core.setFailed(error.message);
        }
    });
}

function getIssueInfo() {
    const issue = github.context.payload.issue;
    const comment = github.context.payload.comment;
    const userid = github.context.payload.comment.user.node_id;
    if (!issue) {
        return;
    }
    return {
        body: comment ? comment.body : issue.body,
        issueNodeId: issue.node_id,
        userId: userid,
    };
}


function addAssigneesToAssignable(client, userId, issueNodeId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.graphql(`mutation Assing($input: AddAssigneesToAssignableInput!) {
    addAssigneesToAssignable(input: $input) {
        assignable {
          ... on Issue {
            number
          }
        }
      }
    }
  `, {
            input: {
                assignableId: issueNodeId,
                assigneeIds: [userId],
            },
        });
    });
}

run();