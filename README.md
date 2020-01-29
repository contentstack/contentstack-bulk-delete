# Contentstack Bulk Delete Utility

Contentstack is a headless CMS with an API-first approach that puts content at the centre. It is designed to simplify the process of publication by separating code from content.

Contentstack's Bulk Delete Utility allows you to perform bulk delete operations. That means, that it is possible to delete all content types or a specific content type(s), and all assets in just one operation.

## Installation

Download this project and install all the modules using following command.

```bash
npm install
```

## Configuration

Update configuration details at config/index.js

```js
{
 master_locale: {
  name: '', // Stack's master locale. ex: 'English - United States'
  code: ''  // Stack master locale's code. ex: 'en-us'
 },
 email: '', // Your registered email id
 password: '', // Account password
 source_stack: '' // Stack api_key
 access_token: '' // Stack access_token
 content_types_list:'', // For specify the specific contenttypes in array eg: ['product', 'category']
 assetsdelete: '' //Set Bollean value, Example: true or false 
 ...
}
```
    
## Usage
After setting the configuration, you can run the below given commands!

  
 Delete a specific module
```bash
$ npm run delete-assets
$ npm run delete-contenttypes
$ npm run start

```

### Known issues
* Empty folder in assets will not be deleted.


## License
This project is licensed under MIT license
