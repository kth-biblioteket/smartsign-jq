var table;
$(document).ready(function() {
    var counter = 10;

    

    function addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

    function converttimestamp(timestamp){
        var date = new Date(timestamp * 1000);
        var hours = this.addZero(date.getHours());
        var minutes = this.addZero(date.getMinutes());
        var seconds = this.addZero(date.getSeconds());
        var formattedTime = hours + ':' + minutes;// + ':' + seconds;
        return formattedTime;
    }

    var clusterlevel = $("#clusterlevels").val()
    getaddresses(clusterlevel,'0');
    
    
});
function getaddresses(clusterlevel,label) {
    table = $('#addresses').DataTable({
        "serverSide" : true,
        //"scrollY": 300,
        "processing" : true,
        "ajax" : {
            "url" : 'https://lib.kth.se/bibmet/api/v1/addresses/' + clusterlevel +'/' + label + '/1980?token=21987nn098n897098h09sdafb97b098a7s6fv0a6sfbnnmklvbnfay4569755432h22hjfgf2',
            "type": 'post',
            "dataSrc": ""
        },
        "columns" : [ {
            "data" : "UT"
        }, {
            "data" : "Unified_org_id"
        }, {
            "data" : "Org_divided"
        }, {
            "data" : "Name_eng"
        }, {
            "data" : "City"
        }, {
            "data" : "Country_name"
        }]
    });
}
function getPublications(clusterlevel){ 
    

    /* table.on( 'xhr', function () {
        var json = table.ajax.json();
        alert( json.data.length +' row(s) were loaded' );
    }); */
    //uppdatera html
    $("#header3").html('<h3>Publications per year</h3>');
    var currenttimestamp = Math.floor(Date.now() /1000);
    console.log("dsfsfds");
    console.log($("#clusterlevels").val());
    var clusterlevel = $("#clusterlevels").val()
    //currenttimestamp = 1521299582;
    var html = '';
    $.ajax({
        url: 'https://lib.kth.se/bibmet/api/v1/publicationcount/' + clusterlevel +'/0/1980?token=21987nn098n897098h09sdafb97b098a7s6fv0a6sfbnnmklvbnfay4569755432h22hjfgf2'
    })
    .done(function( data ) {
        console.log(data.data);
        publicationSuccess( data.data );
    });
    //hämta ny data efter x millisekunder
    //setTimeout(function(){ getroomAvailability(area_id) }, 5000);
}

/**
 * 
 * Funktion för att hantera fel
 * 
 */
$(document).ajaxError(function (event, jqxhr, settings) {
    if (1 == 1) {
          console.log(jqxhr.responseText);
    }
});

/**
 * 
 * Funktion som hanterar svar från API
 * 
 */
function publicationSuccess(data) {
    years = [];
    antal = [];
    //jqxhr.forEach(function(element) {
    //});

    //placera in värden i varsin array för respektive x-axel och y-axel
    var years = data.map(function(e) {
        return e.publicationyear;
    });
    var counts = data.map(function(e) {
        return e.publicationcount;
    });
    $('.chartcontainer').remove();
    $("#charts").append('<div class="chartcontainer"><canvas style="" id="' + 'chartname' + '"></canvas><div style="padding-left: 10px; color: rgba(200, 200, 200, .75);font-size: 12px"> Clusterlevel: ' +  'clusterlevel' + ' Selected cluster:' +  'selected_cluster' + '</div><div>') 
    var ctx = $("#" + 'chartname');
    var config = {
        type: 'line',
        data: {
           responsive: false,
           maintainAspectRatio: false,
           labels: years,
           datasets: [{
              label: 'Graph Line',
              data: counts,
              borderColor:	'rgba(23, 234, 204, 0.3)'
              //backgroundColor: 'rgba(23, 234, 204, 0.3)'
           }]
        }
     };
    var myLineChart = new Chart(ctx, config);
    var clusterlevel = $("#clusterlevels").val()
    var label = '0'
    table.ajax.url( 'https://lib.kth.se/bibmet/api/v1/addresses/' + clusterlevel +'/' + label + '/1980?token=' ).load();
};

