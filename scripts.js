var string = [];
var falseCount = 0;

function sleep(milliseconds) {
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) > milliseconds){
			break;
		}
	}
};

function processSrcImg() {
	var subscriptionKey = "4dd3400e4f24445fb3e0d422673d42a2";
	var uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";

            // Request parameters.
            var params = {
            	"returnFaceId": "true",
            	"returnFaceLandmarks": "false",
            };

            sourceImageUrl = $('#sourceImage').attr('src');

            // Perform the REST API call.
            $.ajax({
            	url: uriBase + "?" + $.param(params),

                // Request headers.
                beforeSend: function (xhrObj) {
                	xhrObj.setRequestHeader("Content-Type", "application/json");
                	xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
                },

                type: "POST",

                // Request body.
                data: '{"url": ' + '"' + sourceImageUrl + '"}',
            })

            .done(function (data) {
                    // Show formatted JSON on webpage.
                    var x = JSON.stringify(data, null, 2);
                    x = x.substring(1, x.length - 1)
                    var obj = JSON.parse(x);
                    string[0] = obj.faceId;
                })

            .fail(function (jqXHR, textStatus, errorThrown) {
                    // Display error message.
                    var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
                    errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
                    jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
                    console.log(errorString);
                });
        };

        function processLibrary() {
        	while (string.length > 1) {
        		string.pop();
        	}
        	for (var i = 1; i < 10; i++) {
        		var s = $('#lib' + i).attr('src');
        		if (s != null)
        			processImage(s, i);
        	}
        };

        function processImage(sourceImageUrl, index) {
        	var subscriptionKey = "4dd3400e4f24445fb3e0d422673d42a2";
        	var uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";

            // Request parameters.
            var params = {
            	"returnFaceId": "true",
            	"returnFaceLandmarks": "false",
            };

            // Display the image.

            // Perform the REST API call.
            $.ajax({
            	url: uriBase + "?" + $.param(params),

                // Request headers.
                beforeSend: function (xhrObj) {
                	xhrObj.setRequestHeader("Content-Type", "application/json");
                	xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
                },

                type: "POST",

                // Request body.
                data: '{"url": ' + '"' + sourceImageUrl + '"}',
            })

            .done(function (data) {
                    // Show formatted JSON on webpage.
                    var x = JSON.stringify(data, null, 2);
                    x = x.substring(1, x.length - 1)
                    var obj = JSON.parse(x);
                    string[index] = obj.faceId;
                })

            .fail(function (jqXHR, textStatus, errorThrown) {
                    // Display error message.
                    var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
                    errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
                    jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
                    console.log(errorString);
                });
        };

        function verifyPair(string1, string2) {
        	var params = {
                // Request parameters
            };

            $.ajax({
            	url: "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/verify?" + $.param(params),
            	beforeSend: function (xhrObj) {
                    // Request headers
                    xhrObj.setRequestHeader("Content-Type", "application/json");

                    // NOTE: Replace the "Ocp-Apim-Subscription-Key" value with a valid subscription key.
                    xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "4dd3400e4f24445fb3e0d422673d42a2");
                },
                type: "POST",
                // Request body
                data: '{"faceId1": ' + '"' + string1 + '"' + ', "faceId2": ' + '"' + string2 + '"}',
            })
            .done(function (data) {
            	console.log(data.isIdentical);
            	if (data.isIdentical == true) {
            		$($('.loader')[0]).attr('style','display:none');
            		var ind = 0;
            		for (var i = 1; i < 10; i++) {
            			if (string[i] == string2) {
            				ind = i;
            				break;
            			}
            		}
            		var srcpic = $('#lib' + ind).attr('src');
            		var htmlString = "<div class='w3-panel w3-quarter w3-center'><img width='220px' height='220px' src='" + srcpic + "' /><br /> <h3 class='w3-center w3-blue'>" + data.confidence + "</h3><br></div>";
            		document.querySelector('#id01').innerHTML = document.querySelector('#id01').innerHTML + htmlString;
            	}
                else {
                    falseCount ++ ;
                    if (falseCount == 9){
                        document.querySelector('#id01').innerHTML = "<div class='w3-panel w3-xlarge'>Không có ảnh nào trùng khớp</div>";
                    }
                }
            })
            .fail(function () {
            	console.log("error");
            });
        };

        function verify() {
            falseCount = 0
        	for (var i = 1; i < 10; i++) {
        		if (string[i] != null)
        			verifyPair(string[0], string[i]);
        	}
        };

        function run(){
            document.querySelector('#id01').innerHTML = '<h3> Những gương mặt trùng khớp: </h3><div style="display:block" class="loader"></div>';
        	document.getElementById('id01').style.display='block';
        	setTimeout(processSrcImg(), 100);
        	setTimeout(processLibrary(), 100);
        	var i=0;
            function x(){
                setTimeout(function a(){
                if (string.length == 10)
                    verify();
                else
                    x();
                },5000);
            }
            x();
        };