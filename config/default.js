module.exports = {
  versioning: false,
  host: 'https://api.contentstack.io/v3',
  cdn: 'https://cdn.contentstack.io/v3',
  modules: {
    types: [
      'delete_contentTypes',
      'delete_assets'    
    ],
  },
  apis: {
    assets: '/assets/',
    content_types: '/content_types/'
  }
}
