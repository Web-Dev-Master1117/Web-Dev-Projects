
# Build a Library

Congratulations, you’ve passed the grueling rigmarole of librarian school and have become head librarian at your local Books-‘N-Stuff.

Just as you sit down, eager to utilize all those skills you learned in “Lib 203 - Shushing: How to Maintain Order While Spitting”, you realize you’re still using index cards to handle everything.

But no matter, you know some JavaScript, so let’s get to work modernizing your new digs.

Books-‘N-Stuff carries three different types of media: books, CDs, and movies. In this project you will create a parent class named  `Media`  with three subclasses:  `Book`,  `Movie`, and  `CD`. These three subclasses have the following properties and methods:

#### Book

-   **Properties**:  `author`  (string),  `title`  (string),  `pages`  (number),  `isCheckedOut`  (boolean, initially  `false`), and  `ratings`  (array, initially empty).
-   **Getters**: all properties have a getter
-   **Methods**:  `.getAverageRating()`,  `.toggleCheckOutStatus()`, and  `.addRating()`

#### Movie

-   **Properties**:  `director`  (string),  `title`  (string),  `runTime`  (number),  `isCheckedOut`  (boolean, initially  `false`), and  `ratings`  (array, initially empty)
-   **Getters**: all properties have a getter
-   **Methods**:  `.getAverageRating()`,  `.toggleCheckOutStatus()`, and  `.addRating()`

#### CD

-   **Properties**:  `artist`  (string),  `title`  (string),  `isCheckedOut`  (boolean, initially  `false`), and  `ratings`  (array, initially empty),  `songs`  (array of strings)
-   **Getters**: all properties have a getter
-   **Methods**:  `.getAverageRating()`,  `.toggleCheckOutStatus()`, and  `.addRating()`
