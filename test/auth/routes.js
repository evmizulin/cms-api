const routes = [
  {
    route: () => '/projects',
    methods: [
      {
        method: 'post',
        tests: {
          extractClientId: true,
          checkClientPermission: true,
        },
      },
      {
        method: 'get',
        tests: {
          extractClientId: true,
          checkClientPermission: true,
        },
      },
    ],
  },
  {
    route: ({ projectId }) => `/projects/${projectId}/image.png`,
    methods: [
      {
        method: 'get',
        tests: {
          extractClientId: true,
          checkClientPermission: true,
          extractProjectId: true,
          checkProjectPermission: true,
        },
      },
    ],
  },
  {
    route: ({ projectId }) => `/projects/${projectId}`,
    methods: [
      {
        method: 'put',
        tests: {
          extractClientId: true,
          checkClientPermission: true,
          extractProjectId: true,
          checkProjectPermission: true,
        },
      },
      {
        method: 'delete',
        tests: {
          extractClientId: true,
          checkClientPermission: true,
          extractProjectId: true,
          checkProjectPermission: true,
        },
      },
    ],
  },
  {
    route: ({ projectId }) => `/projects/${projectId}/api-tokens`,
    methods: [
      {
        method: 'post',
        tests: {
          extractClientId: true,
          checkClientPermission: true,
          extractProjectId: true,
          checkProjectPermission: true,
        },
      },
      {
        method: 'get',
        tests: {
          extractClientId: true,
          checkClientPermission: true,
          extractProjectId: true,
          checkProjectPermission: true,
        },
      },
    ],
  },
  {
    route: ({ projectId, appId }) => `/projects/${projectId}/api-tokens/${appId}`,
    methods: [
      {
        method: 'put',
        tests: {
          extractClientId: true,
          checkClientPermission: true,
          extractProjectId: true,
          checkProjectPermission: true,
          extractAppId: true,
          checkAppPermission: true,
        },
      },
      {
        method: 'delete',
        tests: {
          extractClientId: true,
          checkClientPermission: true,
          extractProjectId: true,
          checkProjectPermission: true,
          extractAppId: true,
          checkAppPermission: true,
        },
      },
    ],
  },
  {
    route: () => `/users`,
    methods: [
      {
        method: 'get',
        tests: {
          extractClientId: true,
          checkClientPermission: true,
        },
      },
    ],
  },
  {
    route: ({ projectId }) => `/projects/${projectId}/users`,
    methods: [
      {
        method: 'post',
        tests: {
          extractClientId: true,
          checkClientPermission: true,
          extractProjectId: true,
          checkProjectPermission: true,
        },
      },
      {
        method: 'get',
        tests: {
          extractClientId: true,
          checkClientPermission: true,
          extractProjectId: true,
          checkProjectPermission: true,
        },
      },
    ],
  },
  {
    route: ({ projectId, userId }) => `/projects/${projectId}/users/${userId}`,
    methods: [
      {
        method: 'delete',
        tests: {
          extractClientId: true,
          checkClientPermission: true,
          extractProjectId: true,
          checkProjectPermission: true,
          extractUserId: true,
          checkUserPermission: true,
        },
      },
    ],
  },
  {
    route: ({ projectId, userId }) => `/projects/${projectId}/users/${userId}/permissions`,
    methods: [
      {
        method: 'get',
        tests: {
          extractClientId: true,
          checkClientPermission: true,
          extractProjectId: true,
          checkProjectPermission: true,
          extractUserId: true,
          checkUserPermission: true,
        },
      },
      {
        method: 'put',
        tests: {
          extractClientId: true,
          checkClientPermission: true,
          extractProjectId: true,
          checkProjectPermission: true,
          extractUserId: true,
          checkUserPermission: true,
        },
      },
    ],
  },
  {
    route: ({ projectId }) => `/projects/${projectId}/files`,
    methods: [
      {
        method: 'post',
        tests: {
          extractClientId: true,
          extractProjectId: true,
          checkProjectPermission: true,
        },
      },
    ],
  },
  {
    route: ({ projectId, fileId, fileName }) => `/projects/${projectId}/files/${fileId}/${fileName}`,
    methods: [
      {
        method: 'get',
        tests: {
          extractClientId: true,
          extractProjectId: true,
          checkProjectPermission: true,
          extractFileId: true,
          checkFilePermission: true,
        },
      },
    ],
  },
  {
    route: ({ projectId, appId }) => `/projects/${projectId}/api-tokens/${appId}/permissions`,
    methods: [
      {
        method: 'get',
        tests: {
          extractClientId: true,
          checkClientPermission: true,
          extractProjectId: true,
          checkProjectPermission: true,
          extractAppId: true,
          checkAppPermission: true,
        },
      },
      {
        method: 'put',
        tests: {
          extractClientId: true,
          checkClientPermission: true,
          extractProjectId: true,
          checkProjectPermission: true,
          extractAppId: true,
          checkAppPermission: true,
        },
      },
    ],
  },
  {
    route: ({ projectId }) => `/projects/${projectId}/models`,
    methods: [
      {
        method: 'get',
        tests: {
          extractClientId: true,
          extractProjectId: true,
          checkProjectPermission: true,
        },
      },
      {
        method: 'post',
        tests: {
          extractClientId: true,
          extractProjectId: true,
          checkProjectPermission: true,
        },
      },
    ],
  },
  {
    route: ({ projectId, modelId }) => `/projects/${projectId}/models/${modelId}`,
    methods: [
      {
        method: 'get',
        tests: {
          extractClientId: true,
          extractProjectId: true,
          checkProjectPermission: true,
          extractModelId: true,
          checkModelPermission: true,
        },
      },
      {
        method: 'put',
        tests: {
          extractClientId: true,
          extractProjectId: true,
          checkProjectPermission: true,
          extractModelId: true,
          checkModelPermission: true,
        },
      },
      {
        method: 'delete',
        tests: {
          extractClientId: true,
          extractProjectId: true,
          checkProjectPermission: true,
          extractModelId: true,
          checkModelPermission: true,
        },
      },
    ],
  },
  {
    route: ({ projectId }) => `/projects/${projectId}/entries`,
    methods: [
      {
        method: 'get',
        tests: {
          extractClientId: true,
          extractProjectId: true,
          checkProjectPermission: true,
        },
      },
      {
        method: 'post',
        tests: {
          extractClientId: true,
          extractProjectId: true,
          checkProjectPermission: true,
        },
      },
    ],
  },
  {
    route: ({ projectId, entryId }) => `/projects/${projectId}/entries/${entryId}`,
    methods: [
      {
        method: 'get',
        tests: {
          extractClientId: true,
          extractProjectId: true,
          checkProjectPermission: true,
          extractEntryId: true,
          checkEntryPermission: true,
        },
      },
      {
        method: 'put',
        tests: {
          extractClientId: true,
          extractProjectId: true,
          checkProjectPermission: true,
          extractEntryId: true,
          checkEntryPermission: true,
        },
      },
      {
        method: 'delete',
        tests: {
          extractClientId: true,
          extractProjectId: true,
          checkProjectPermission: true,
          extractEntryId: true,
          checkEntryPermission: true,
        },
      },
    ],
  },
]

module.exports = { routes }
