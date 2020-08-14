// Helper for getting the `index.html?ID=` part form the URL
var getParameterByName = function(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
// Airtable API Key, unique per user
var api_key = 'keyB7EQxA9Lt2lvXE'

//This is the url from the Airtable Authentication section
var airtable_list_url = 'https://api.airtable.com/v0/appeG8kkwJsPViya8/Art%20Pieces?api_key=keyB7EQxA9Lt2lvXE';

var listView = function(id, piecename, ranking, artstyle) {
    return `<div class="col-sm-6">
    <div class="card mb-4 box-shadow">
          <h2><a href="?id=${id}">${piecename}</a></h2>
          <div class="d-flex justify-content-between align-items-center">
          <small class="text-muted">${ranking}</small>
          <small class="text-muted">${artstyle}</small>
          </div>
        </div>
    </div>`;
  }
// Get and display the data for all items
 var getDataForList = function() {  
  // This is where we get the JSON data from Airtable!
  $.getJSON( airtable_list_url, function( data ) {
    //console.log(data.records);
    var html = [];
    html.push(`<div class="row">`);
    // 2. Iterates over every record and uses the list template
    $.each( data.records, function( index, val ) {
     //console.log(val.fields)
        var id = val.id;
        var fields = val.fields;
        var piecename = fields["PieceName"];
        var ranking = fields["Ranking"];
        var artstyle = fields["ArtStyle"];
        var itemHTML = listView(id, piecename, ranking, artstyle);
        html.push(itemHTML);
        [{field: "PieceName", direction: "desc"}]
        //piecename.sort();
    });
    html.push(`</div>`);
  // 3. Adds HTML for every item to our page
  $(".list-view").append(html.join(""));
});
}

// Template that generates HTML for one item in our detail view, given the parameters passed in
var detailView = function(id, piecename, images, descriptions, ranking) {
  return `<div class="col-sm-12">
    <div class="card mb-4 box-shadow">
      <img class="card-img-top" src="${images}">
      <div class="card-body">
        <h2><a href="?id=${id}">${piecename}</a></h2>
        <div class="d-flex justify-content-between align-items-center">
          <small class="text-muted">${descriptions}</small>
          <small class="text-muted">${ranking}</small>
        </div>
        <hr />
      </div>
    </div>
  </div>`;
}

// Get and display the data for one item based on on the ID
var getDataForId = function(id) {
  $.getJSON(`https://api.airtable.com/v0/appeG8kkwJsPViya8/Art%20Pieces/${id}?api_key=keyB7EQxA9Lt2lvXE`, function( record ) {
    //console.log(data);
    var html = [];
    html.push(`<div class="row">`);
      //console.log(val)
      var id = record.id;
      var fields = record.fields;
      var piecename = fields["PieceName"];
      var images= fields["Images"] ? fields["Images"][0].url : '';
      var descriptions = fields["Descriptions"];
      var ranking= fields["Ranking"];
      var itemHTML = detailView(id, piecename, images, descriptions, ranking);
      html.push(itemHTML);
    html.push(`</div>`);
    $(".detail-view").append(html.join(""));
  });
}

// Do we have an ID in the URL?
var id = getParameterByName("id");

// If we have an ID, we should only get the data for one item
// Otherwise, we should display the data for all items
if (id) {
  getDataForId(id);
} else {
  getDataForList();
}
