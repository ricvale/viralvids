function tplawesome(e,t){res=e;for(var n=0;n<t.length;n++){res=res.replace(/\{\{(.*?)\}\}/g,function(e,r){return t[n][r]})}return res}


$(function () {
			  $("#datepicker").datepicker({ 
					autoclose: true, 
					todayHighlight: true,
					container:'.date',
					minViewMode:0,
					format: 'yyyy-mm-dd',
					endDate: '+0d',
					calendarWeeks: true,
					//clearBtn: true,
					startView:'year',
					todayBtn: true,
				    defaultViewDate: 'today'
				
			  }); //.datepicker('update', new Date());
});

$(function() {
    $("form").on("submit", function(e) {
		dateSelected = '' + ($("#date").val());
		
       e.preventDefault();
       // prepare the request
       var request = gapi.client.youtube.search.list({
	   part: "snippet",
            type: "video",
            q: encodeURIComponent($("#search").val()).replace(/%20/g, "+"),
            maxResults: 3,
            order: "viewCount",
            publishedAfter: dateSelected + "T00:00:00Z"
       }); 
       // execute the request
       request.execute(function(response) {
          var results = response.result;
		  
		  ids ="";
          $.each(results.items, function(index, item) {		
				ids = ids + item.id.videoId +','	
          });
		  get_stats(ids, results);      
       });
    });
	
}); 


function get_stats(videoIds, results) {
	   
	var request2 = gapi.client.youtube.videos.list({
      // The 'id' property's value is a comma-separated string of video IDs.
      id: videoIds,
      part: 'snippet,statistics'
    });
	
	views = [];
	likes = [];
	dislikes = [];
	
	  request2.execute(function(response2) {
          results2 = response2.result;
		  for (i=0; i<3; i++){ 
			views.push ((results2.items[i].statistics.viewCount)); 
			likes.push ((results2.items[i].statistics.likeCount)); 
			dislikes.push ((results2.items[i].statistics.dislikeCount)); 
		  }  
		  //console.log(JSON.stringify(views) );
		  
		  afterExecute(views, likes, dislikes);
		  
		  afterExecuteAll(results, views, likes, dislikes);
	   } );
}

function afterExecute(views){
	
			  views.push(views);
			  likes.push(views);
			  dislikes.push(views);
}
function afterExecuteAll(results, viewsArr){
			$("#results").html("");
			
			$.each(results.items, function(index, item) {		
			
            $.get("tpl/item.html", function(data) {
			
				
                $("#results").append(tplawesome(data, [{ "title": item.snippet.title, "videoid":item.id.videoId, 
															"publishedAt":item.snippet.publishedAt.substring(0, 10),
														//"description":item.snippet.description,
														"views": (views[index]).toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ","),
														"likes": (likes[index]).toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ","),
														"dislikes": (dislikes[index]).toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ","),
														}]));
            });
          });
	 
}


function init() {
    gapi.client.setApiKey("AIzaSyDXiz0Xy_fVe3dGkDBtKxF5ryj98hogNfQ");
    gapi.client.load("youtube", "v3", function() {
        // yt api is ready
    });
}
