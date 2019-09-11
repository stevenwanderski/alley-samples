# Code Samples

### thriftedandmodern.com (PHP)

As a solo freelance developer, I was tasked with the rebuilding and migration of Thrifted + Modern (online vintage clothing seller) from an eBay store to a Drupal e-commerce platform. I handled all technical aspects of the project including the setup and customization of the commerce platform, the data migration, and the front-end implementation of the design. While I developed many interesting solutions for the platform, one feature remains memorable: a drag n' drop page layout tool for site admins.

The feature requirement was to allow site admins the ability to select one of six page layouts - each layout containing one more grid item than the last. After selecting a page layout, images could be dragged from the store catalog onto each grid item. After the image was moved to the correct directory, a preview of the image grid item was displayed in real-time. After all grid items were populated, a link was provided to view the page on the front-end.

I am proud of this feature because it solved a large pain point for site admins. Before the tool existed, site admins would have to laboriously upload images to an admin tool and have to guess how the image would look in the grid layout. This tool removed the multiple page loads and guess work from site admins' daily workflow.

Drupal module: https://github.com/stevenwanderski/code-samples/blob/master/thrifted/bxdev_drag.module.php  
Javascript: https://github.com/stevenwanderski/code-samples/blob/master/thrifted/bxdev_drag.js



### 4agoodcause.com (React / Rails)

Rebuilding the 4agoodcause.com platform has been one of my greatest achievements. The codebase is now three years old and remains relatively bug-free. I am still excited and full of joy when contributing to this product. The following code was written for a donor profile page that allows an admin user the ability to update different bits of a donor's information including: contact info, relationship to other donors, and custom form fields.

React is used for the front-end and Rails is used for the API requests and tests.

I am proud of this code because it successfully marries React and Rails without having an isolated JS front-end. This gives many benefits such as simple authentication / authorization performed by Rails and efficient full-stack acceptance testing.

React components: https://github.com/stevenwanderski/code-samples/tree/master/foragoodcause/react-components (the container.jsx component renders all other components)  
API endpoints: https://github.com/stevenwanderski/code-samples/tree/master/foragoodcause/controllers  
Tests: https://github.com/stevenwanderski/code-samples/tree/master/foragoodcause/tests



### popularpays.com (Ember / Rails)

The Popular Pays influencer-facing app is built with an Ember front-end and Rails back-end. The following code allows an influencer the ability to dismiss a potential gig and never see it again. I am proud of this code because it uses synchronous JS code (by way of generator functions and a "concurrency" library) that allows for better progress checking, error handling and readability.

Ember component JS: https://github.com/stevenwanderski/code-samples/blob/master/poppays/campaign.js#L13  
Ember component template: https://github.com/stevenwanderski/code-samples/blob/master/poppays/campaign.hbs#L12  
Tests: https://github.com/stevenwanderski/code-samples/blob/master/poppays/campaign-dismiss-test.js
