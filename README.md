# Contentstack Export Utility

Contentstack is a headless CMS with an API-first approach that puts content at the centre. It is designed to simplify the process of publication by separating code from content.

The Bulk Delete Utility allows you to perform the delete operation on all content types or specific content type(s), and all assets.

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
  //Bollean value
  //Example: true or false 
  assetsdelete: ''
 ...
}
```
    
## Usage
After setting the configuration, you'll can run the below given commands!

  
 Delete a specific module
```bash
$ npm run delete-assets
$ npm run delete-contenttypes

```

### Known issues
* Empty folder in assets will not be deleted.


## License
This project is licensed under MIT license
