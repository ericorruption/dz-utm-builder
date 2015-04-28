// Convert to title case - used in all the parameters
String.prototype.toTitleCase = function () {
    var smallWords = /^(e|de|a|o|as|os|do|da|dos|das|vs?\.?|via)$/i;

    return this.replace(/([^\W_]+[^\s-]*) */g, function (match, p1, index, title) {
        if (index > 0 && index + p1.length !== title.length &&
        p1.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
        title.charAt(index - 1).search(/[^\s-]/) < 0) {
            return match.toLowerCase();
        }

        if (p1.substr(1).search(/[A-Z]|\../) > -1) {
            return match;
        }

        return match.charAt(0).toUpperCase() + match.substr(1);
    });
};

var cleanInput = function(input){
    // trim spaces at start/end of string, remove multiple spaces, convert spaces to -, convert accents
    output = input.replace(/-/g, ' ')
                  .replace(/(^\s+|\s+$)/g, '')
                  .replace(/\s+/g, ' ')
                  .replace(/ /g, '-')
                  .replace(/&/g, '%26')
                  .replace(/[ÀÁÂÃ]/g, 'A')
                  .replace(/[àáâã]/g, 'a')
                  .replace(/[ÈÉÊ]/g, 'E')
                  .replace(/[èéê]/g, 'e')
                  .replace(/[ÌÍÎ]/g, 'I')
                  .replace(/[ìíî]/g, 'i')
                  .replace(/[ÒÓÔÕ]/g, 'O')
                  .replace(/[òóôõ]/g, 'o')
                  .replace(/[ÙÚ]/g, 'U')
                  .replace(/[ùú]/g, 'u')
                  .replace(/ç/g, 'c');
    return output;
};

// ZeroClipboard stuff
ZeroClipboard.setDefaults( { moviePath: 'js/ZeroClipboard.swf' } );
var clip = new ZeroClipboard(document.getElementById('copy'));
if (window.onresize) {
    window.onresize = clip.reposition();
}

// Knockout JS stuff
var ViewModel = function() {
    this.utmSourceValues = [
        'DZ-Google',
        'DZ-Facebook',
        'DZ-Twitter',
        'DZ-Easy-Mailing',
        'DZ-Locaweb',
        'DZ-Youtube',
        'DZ-Clic-RBS',
        'Outro'
    ];

    this.utmMediumValues = [
        'DZ-Ads',
        'DZ-Display',
        'DZ-Banner',
        'DZ-Mobile',
        'DZ-Email-Mkt',
        'DZ-Overlay',
        'DZ-Organic',
        'DZ-Post',
        'DZ-Video',
        'DZ-Remarketing',
        'Outro'
    ];

    this.plainUrl  = ko.observable();
    this.utmSource = ko.observable();
    this.customSource = ko.observable();
    this.utmMedium = ko.observable();
    this.customMedium = ko.observable();
    this.utmTerm  = ko.observable();
    this.utmContent  = ko.observable();
    this.utmCampaign  = ko.observable();

    this.fullUrl = ko.computed(function() {
        var url = '';

        // Return only if all required fields have values
        if (this.plainUrl() && this.utmSource() && this.utmMedium() && this.utmCampaign()) {

            this.plainUrl(cleanInput(this.plainUrl()));

            if (this.plainUrl().substring(0,7) === 'http://' || this.plainUrl().substring(0,8) === 'https://') {
                url += this.plainUrl();
            } else {
               url += 'http://' + this.plainUrl();
            }

            var hashPieces = url.split('#');

            if (hashPieces.length > 1) {
                url = hashPieces[0];
            }

            if (this.plainUrl().indexOf('?') === -1) {
                url += '?';
            } else {
                url += '&';
            }

            if (this.utmSource() === 'Outro'){
                var clearCustomSource = cleanInput(this.customSource().toTitleCase());
                if (clearCustomSource.substring(0,3) !== 'DZ-'){
                    clearCustomSource = 'DZ-' + clearCustomSource;
                }
                url += 'utm_source=' + clearCustomSource;
            } else {
                url += 'utm_source=' + cleanInput(this.utmSource());
            }

            if (this.utmMedium() === 'Outro'){
                var clearCustomMedium = cleanInput(this.customMedium().toTitleCase());
                if (clearCustomMedium.substring(0,3) !== 'DZ-'){
                    clearCustomMedium = 'DZ-' + clearCustomMedium;
                }

                url += '&utm_medium=' + clearCustomMedium;
            } else {
                url += '&utm_medium=' + cleanInput(this.utmMedium());
            }

            if (this.utmTerm()){
                url += '&utm_term=' + cleanInput(this.utmTerm().toLowerCase());
            }
            if (this.utmContent()){
                url += '&utm_content=' + cleanInput(this.utmContent().toTitleCase());
            }

            url += '&utm_campaign=' + cleanInput(this.utmCampaign().toTitleCase());

            if (hashPieces.length > 1) {
                url = url + '#' + hashPieces[1];
            }
        }

        return url;
    }, this);

    // UTM Campaign
    this.utmCampaign.subscribe(function(newValue) {
        // Check if starts with 'DZ...'
        if (newValue.length > 0) {
            if(!newValue.toTitleCase().startsWith('DZ')) {
                this.target('DZ-' + newValue);
            }
        }
    });

    // UTM Content
    this.utmContent.subscribe(function(newValue) {
        // Check if starts with 'DZ...'
        if (newValue.length > 0) {
            if(!newValue.toTitleCase().startsWith('DZ')) {
                this.target('DZ-' + newValue);
            }
        }
    });
};

ko.applyBindings(new ViewModel());