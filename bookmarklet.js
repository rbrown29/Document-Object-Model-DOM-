javascript: (
    void (
        function () {
            var fileRef;

            var loaded = false;

            try {
                loaded = checkDocumentWCAG;
            } catch (error) {

            }
            if (!loaded) {
                fileRef = document.createElement('link');
                fileRef.rel = 'stylesheet';
                fileRef.type = 'text/css';
                fileRef.href = 'https://localhost/CIS233W/lab4/wcag/wcag.css';
                document.getElementsByTagName("head")[0].appendChild(fileRef);

                fileRef = document.createElement('script');
                fileRef.src = 'https://localhost/CIS233W/lab4/wcag/wcag.js';
                fileRef.type = 'text/javascript';
                document.getElementsByTagName("head")[0].appendChild(fileRef);
            } else {
                checkDocumentWCAG();
            }
        }()
    )
)