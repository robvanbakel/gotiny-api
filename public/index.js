const GoTiny = {
  data() {
    return {
      userInput: '',
      output: '',
      error: false,
      showOutput: false,
      showLinkCopied: false,
      errorMessage: null,
      placeholderContent: [
        'https://google.com/very%20long%20url',
        'https://youtube.com/very%20long%20url',
        'https://wikipedia.org/very%20long%20url',
        'https://twitter.com/very%20long%20url',
        'https://facebook.com/very%20long%20url',
        'https://amazon.com/very%20long%20url',
        'https://yelp.com/very%20long%20url',
        'https://reddit.com/very%20long%20url',
        'https://imdb.com/very%20long%20url',
        'https://pinterest.com/very%20long%20url',
        'https://instagram.com/very%20long%20url',
        'https://linkedin.com/very%20long%20url',
        'https://ebay.com/very%20long%20url',
      ]
    }
  },
  methods: {
    async goTiny() {

      this.errorMessage = null;
      this.error = false;

      const res = await fetch('/apiLocal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ long: this.userInput })
      });

      if (res.status == 200) {
        const link = await res.json();
        this.output = link.tiny;
        this.showOutput = true;

        window.addEventListener('keydown', e => {

          if (this.showOutput) {
            switch (e.key) {
              case 'c':
                this.copyLink();
                break;
              case 'Enter':
              case 'Escape':
                this.closeOutput();
                break;
            }
          }
        });

        this.userInput = '';

      } else {
        this.error = true;
        setTimeout(() => this.error = false, 180);
        this.changePlaceholder();
        if (!this.userInput) {
          this.errorMessage = "Please paste in a long url"
        } else {
          this.errorMessage = "We're like 99% sure that's not a valid url"
        }
      }

    },
    copyLink() {

      if (this.showOutput == true) {

        window.getSelection().selectAllChildren(document.querySelector('.link-output span'));
        document.execCommand("copy");
        window.getSelection().removeAllRanges();

        this.showLinkCopied = true;
        setTimeout(() => this.showLinkCopied = false, 1200);

      }

    },
    closeOutput() {
      this.showOutput = false;
      setTimeout(() => {
        this.$refs.userInput.focus();
      }, 120)

    },
    changePlaceholder() {
      this.$refs.userInput.setAttribute('placeholder', 'e.g. ' + this.placeholderContent[Math.floor(Math.random() * this.placeholderContent.length)])
      this.$refs.userInput.focus();
    }
  },
  mounted() {
    this.$refs.userInput.focus();    
  }
}

Vue.createApp(GoTiny).mount('#app')