$(document).ready(function() {

    function getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        return vars;
    }

    var urlparameters = getUrlVars();
    if (urlparameters.debug=='true') {
        $('.App-footer').html('<div>Debug mode</div>');
        $('.App').css('border','1px solid');
    }

    var defs = {
        value: 0,
        customSectors: {
            percents: true,
            ranges: [{
              color : "rgb(54, 165, 54)",
              lo : 0,
              hi : 39
            },{
              color : "rgb(236, 236, 56)",
              lo : 40,
              hi : 69
            },{
                color : "rgb(223, 165, 57)",
                lo : 70,
                hi : 84
            },{
                color : "rgb(226, 70, 70)",
                lo : 85,
                hi : 100
            }]
        },
        pointer: true,
        pointerOptions: {
            toplength: 0,
            bottomlength: 10,
            bottomwidth: 6,
            stroke: 'none',
            stroke_width: 0,
            stroke_linecap: 'square',
            color: '#000000'
        },
        //gaugeWidthScale: 0.6,
        relativeGaugeSize: true,
        //width: 300,
        //height: 150,
        symbol: "%",
        //title: "",
        //label: "Occupancy",
        valueMinFontSize: 28,
        labelMinFontSize: 14,
        minLabelMinFontSize: 14, 
        maxLabelMinFontSize: 14,
        startAnimationTime: 0,
        refreshAnimationTime: 0

    };

    function addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

    function gettodaysdate() {
        var today = new Date();
        var dd = addZero(today.getDate());
        var mm = addZero(today.getMonth()+1); //January is 0!
        var yyyy = today.getFullYear();
        var todaysdate = yyyy + '' + mm + '' + dd;
        return todaysdate;
    }

    function getcurrenttime() {
        var today = new Date(),
            h = addZero(today.getHours()),
            m = addZero(today.getMinutes()),
            s = addZero(today.getSeconds());
            
        return h + ":" + m;
    }

    /*
    function logerror(error) {
        $.ajax({
            url: 'logerror.php?error=' + error,
            success: function(response){
                console.log("success " + error)
            },
            error: function(err){
                console.log("err")
            },
            complete: function() {
            }
        });
    }
    */
    /**
     * 
     * Funktion som anropar TimeEdits Api
     * och hämtar ångdomens bokningar(objects=417156.4)
     *
     */
    function getEvents() {
        var todaysdate = gettodaysdate();
        var busy = false;
        $.ajax({
            url: '/webservices/timeedit/?todaysdate=' + todaysdate + '&objects=417156.4',
            success: function(response){
                if(response.reservations.length > 0) {
                    for(var i = 0; i < response.reservations.length; i++) {
                        var currentdate = new Date();
                        var eventenddate = new Date();
                        var eventstartdate = new Date();
                        eventenddate.setHours(response.reservations[i].endtime.substr(0,2),response.reservations[i].endtime.substr(3,2),0);
                        eventstartdate.setHours(response.reservations[i].starttime.substr(0,2),response.reservations[i].starttime.substr(3,2),0);
                        if (eventstartdate < currentdate && eventenddate > currentdate) {
                            occupancyrate = 100;
                            var justgaugeANGDOMEN = new JustGage({
                                id: "justgaugeANGDOMEN",
                                defaults: defs,
                                textRenderer: function (val) {
                                    return ('Busy');
                                },                       
                            });
                            $('#justgaugeANGDOMEN svg').removeAttr("width")
                            $('#justgaugeANGDOMEN svg').removeAttr("height")
                            justgaugeANGDOMEN.refresh(occupancyrate);
                            $('#gaugeANGDOMENheader').html('<div class="content-header">Ångdomen</div>');
                            $('#ANGDOMENinfo').html('<div style="text-align: center"><h6>' + response.reservations[i].starttime.substr(0,5) + ' - ' + response.reservations[i].endtime.substr(0,5) + '</h6></div><div style="text-align: center"><h6>' + response.reservations[i].columns[0] + '</h6></div>');
                            busy = true;
                            break;
                        }
                    }; 
                }
                if(!busy) {
                    getVisitorsAff('#gaugeANGDOMEN','86743795-9a29-457d-988f-9c1aa56717c0',126,'Ångdomen');
                }
            },
            
            error: function(err){
            },
            complete: function() {
            }
             
        });
    }

    /**
     * 
     * Funktion som anropar Affluences Api
     * 
     * @param {*} site 
     * @param {*} siteid 
     * @param {*} availableseats 
     * @param {*} sitename 
     */
    function getVisitorsAff(site,siteid,availableseats, sitename) {
        var currenttimestamp = Math.floor(Date.now() /1000);
        //currenttimestamp = 1521299582;
        var html = '';
        $.ajax({
            url: '/smartsign/aff/affapi.php?siteid=' + siteid + '&time=' + currenttimestamp,
            
            success: function(response){
                if(!response.data) {
                    $(site + 'header').html('<div class="content-header">Information unavailable</div>');
                } else {
                    html = '';
                    var occupancyrate = 0;
                    var availablerate = 0;
                    var circlecolor = 'green';
                    var over50 = '';
                    occupancyrate = Math.round(100*response.data.occupancy/availableseats);
                    occupancyrate = response.data.occupancy_rate;
                    if (!response.data.open) {
                        occupancyrate = 100;
                    }
                    //occupancyrate = 100 - occupancyrate;
                    //occupancyrate = 91;
                    if (occupancyrate > 100) {
                        occupancyrate = 100
                    }
                    
                    //Ändra färg beroende på beläggning
                    if(occupancyrate>50 && occupancyrate<85) {
                        circlecolor = 'orange';
                        over50 = 'over50'
                    }
                    if(occupancyrate>85) {
                        circlecolor = 'red';
                        over50 = 'over50'
                    }

                    $(site + ' .gauge-arrow').trigger('updateGauge', occupancyrate);
                    $(site + 'header').html('<div class="content-header">'+ sitename + '</div>');
                    if (site === "#gaugeNG") {
                        if (!response.data.open) {
                            occupancyrate = 100;
                            $('#justgaugeNG').html('<div><h2>Closed</h2></div>');
                        } else {
                            var justgaugeNG = new JustGage({
                                id: "justgaugeNG",
                                defaults: defs                        
                            });
                            $('#justgaugeNG svg').removeAttr("width")
                            $('#justgaugeNG svg').removeAttr("height")
                            justgaugeNG.refresh(occupancyrate);
                        }
                    }
                    if (site === "#gaugeANGDOMEN") {
                        if (!response.data.open) {
                            occupancyrate = 100;
                            $('#justgaugeANGDOMEN').html('<div><h2>Closed</h2></div>');
                        } else {
                            var justgaugeANGDOMEN = new JustGage({
                                id: "justgaugeANGDOMEN",
                                defaults: defs                        
                            });
                            justgaugeANGDOMEN.refresh(occupancyrate);
                        }
                    }
                }
            },
            
            error: function(){
                $(site + 'header').html('<div class="content-header">'+ sitename + '</div>');
                if (site === "#gaugeANGDOMEN") {
                    $('#justgaugeANGDOMEN').html('<div><h4>Information unavailable</h4></div>');
                } else {
                    $('#justgaugeNG').html('<div><h4>Information unavailable</h4></div>');
                }
            },
            complete: function() {
            }
             
        });
    }
    
    try {
        getEvents()
        getVisitorsAff('#gaugeNG','fca85140-3e80-43e7-ae64-98e58e33611d',95, 'Norra Galleriet');
      }
      catch(error) {
        console.log(error);
      }
});