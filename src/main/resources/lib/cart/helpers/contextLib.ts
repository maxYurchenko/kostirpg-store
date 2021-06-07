import { User } from "enonic-types/auth";

var context = __non_webpack_require__("/lib/xp/context");

export {
  runInDefault,
  runAsAdmin,
  runInDraft,
  runInDraftAsAdmin,
  runAsAdminAsUser,
  runAsAdminInDefault
};

function runAsAdmin(callback: () => any) {
  return context.run(
    {
      user: {
        login: "mvy"
      },
      principals: ["role:system.admin"]
    },
    callback
  );
}

function runAsAdminInDefault(callback: () => any) {
  return context.run(
    {
      repository: "com.enonic.cms.default",
      branch: "master",
      principals: ["role:system.everyone"]
    },
    callback
  );
}

function runAsAdminAsUser(user: User, callback: () => any) {
  return context.run(
    {
      user: {
        login: user.login
      },
      principals: ["role:system.admin"]
    },
    callback
  );
}

function runInDraft(callback: () => any) {
  return context.run(
    {
      branch: "draft"
    },
    callback
  );
}

function runInDraftAsAdmin(callback: () => any) {
  return context.run(
    {
      repository: "com.enonic.cms.default",
      branch: "draft",
      user: {
        login: "mvy"
      },
      principals: ["role:system.admin"]
    },
    callback
  );
}

function runInDefault(callback: () => any) {
  return context.run(
    {
      repository: "com.enonic.cms.default",
      branch: "master"
    },
    callback
  );
}
