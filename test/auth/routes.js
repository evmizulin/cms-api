const routes = [
  {
    route: () => '/projects',
    methods: ['post', 'get'],
  },
  {
    route: projectId => `/projects/${projectId}/image.png`,
    methods: ['get'],
  },
  {
    route: projectId => `/projects/${projectId}`,
    methods: ['put', 'delete'],
  },
  {
    route: projectId => `/projects/${projectId}/api-tokens`,
    methods: ['post', 'get'],
  },
  {
    route: (projectId, tokenId) => `/projects/${projectId}/api-tokens/${tokenId}`,
    methods: ['put', 'delete'],
  },
  {
    route: () => `/users`,
    methods: ['get'],
  },
  {
    route: projectId => `/projects/${projectId}/users`,
    methods: ['post', 'get'],
  },
  {
    route: (projectId, userId) => `/projects/${projectId}/users/${userId}`,
    methods: ['delete'],
  },
  {
    route: (projectId, userId) => `/projects/${projectId}/users/${userId}/permissions`,
    methods: ['get', 'put'],
  },
  {
    route: projectId => `/projects/${projectId}/files`,
    methods: ['post'],
  },
]

module.exports = { routes }
