# Node Web Auction Application

- Built with Docker & Haproxy
- Docker Compose to spin up 4 load balanced instances
- Supports NGINX Reverse Proxy for container to container communications

# Summary of project

## Home Page

- This should be the first page the user is navigated to after logging in to the system. On this page, the user can see the list of existing item (how the list is displayed is your choice, but keep in mind the basic principles of good usability).
- It should have pagination with 10 items per page. It should also have a search box to filter the items by the Name and Description fields. The Price column should be sortable.

## Item Details Page

- Each Auction item will have a Bid Now button next to it. When the Bid Now button is clicked, the client is sent to the details page of the item. The Item Details page displays a countdown timer showing how much time is left before the bidding is closed (the close date and time for the auctions are set by the admin). The client should be able to make a bid on the item.
- The bid made should start at a value that is higher than the last bid made on the item (i.e. If the previous user made a bid for $15, the start bid for the next user should be $16)
- Once the bid is made, the user clicks the Submit Bid button. One user can make multiple bids on the same item, as long as their bid is not the highest in the system.

## The auto-bidding feature

- The ability to activate the auto-bidding will be possible in the Item detail page. A user can activate auto-bidding by clicking on a checkbox in the item detail page aside the Bid now button.
- The next time someone else makes a bid on the marked item, the bot should automatically outbid them by 1.

## Configuring the Auto-bidding

- The Auto-bidding parameters can be configured by the user in a separate page (you can choose at your discretion how to display / show the configurations page).

### These parameters are listed below:

- Maximum bid amount (showing the maximum amount the bot can use for auto bidding purposes)

## Credentials

- There should be dummy user authentication implemented into the system with hardcoded user credentials in the code. No need to have users stored in the Database.
- There should be 1 role in the system for Regular users.

### Their credentials are as follows:

- Regular: user1/user2

### The users should be able to:

- View the list of items
- View the details of a single item

# Features!

- Home Page – Item’s listing (preferably in gallery view)
- Item Detail Page with Item bidding history
- Bid Now functionality
- Auto-bidding functionality
