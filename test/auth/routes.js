const routes = [
  {
    route: () => '/projects',
    methods: [
      {
        method: 'post',
        tests: {
          extractClientId: true,
          checkClientPermission: true,
          extractProjectId: false,
          checkProjectPermission: false,
        },
      },
      {
        method: 'get',
        tests: {
          extractClientId: true,
          checkClientPermission: true,
          extractProjectId: false,
          checkProjectPermission: false,
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
    route: ({ projectId, tokenId }) => `/projects/${projectId}/api-tokens/${tokenId}`,
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
    route: () => `/users`,
    methods: [
      {
        method: 'get',
        tests: {
          extractClientId: true,
          checkClientPermission: true,
          extractProjectId: false,
          checkProjectPermission: false,
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
        },
      },
      {
        method: 'put',
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
    route: ({ projectId }) => `/projects/${projectId}/files`,
    methods: [
      {
        method: 'post',
        tests: {
          extractClientId: true,
          checkClientPermission: false,
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
          checkClientPermission: false,
          extractProjectId: true,
          checkProjectPermission: true,
          extractFileId: true,
          checkFilePermission: true,
        },
      },
    ],
  },
]

module.exports = { routes }
