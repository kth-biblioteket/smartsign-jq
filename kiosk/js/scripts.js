var nrofcalls = 0;

$(document).ready(function() {
    //Hämta events för dagen(pågående och kommande händelser)
    getEvents();
    //Visa Dagens datum
    //document.getElementById('todaysdate').innerHTML = todaysdate();
    //Starta en digital klocka att visa på sidan
    //startTime();
    //Starta en "analog" klocka att visa på sidan
    //drawClock();
});

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function getweekday(nr) {
    var weekday=new Array(7);
    weekday[1]="Måndag";
    weekday[2]="Tisdag";
    weekday[3]="Onsdag";
    weekday[4]="Torsdag";
    weekday[5]="Fredag";
    weekday[6]="Lördag";
    weekday[0]="Söndag";
    return weekday[nr];
}

function getmonth(nr) {
    var month=new Array(7);
    month[0]="Januari";
    month[1]="Februari";
    month[2]="Mars";
    month[3]="April";
    month[4]="Maj";
    month[5]="Juni";
    month[6]="Juli";
    month[7]="Augusti";
    month[8]="September";
    month[9]="Oktober";
    month[10]="November";
    month[11]="December";
    return month[nr];
}

function todaysdate() {
    var todaysdate = "",
        today = new Date(),
        year = today.getFullYear(),
        day = today.getDate(),
        weekday = getweekday(today.getDay()),
        monthname = getmonth(today.getMonth()),
    todaysdate = weekday + " " + day + " " + monthname + ", " + year
    return todaysdate;
}
function startTime() {
    var today = new Date(),
        h = addZero(today.getHours()),
        m = addZero(today.getMinutes()),
        s = addZero(today.getSeconds());
        
    document.getElementById('currenttime').innerHTML = h + ":" + m + ":" + s;
    t = setTimeout(function () {
        startTime()
    }, 1000);
}

/**
 * 
 * Funktion som anropar Lokalbokningens Api
 * 
 */
function getEvents(){
    //Hämta dagens datum
    var today = new Date();
    var dd = addZero(today.getDate());
    var mm = addZero(today.getMonth()+1); //January is 0!
    var yyyy = today.getFullYear();
    var todaysdate = yyyy + '' + mm + '' + dd;
    //CORS funkar inte i IE9 (som smartsign bygger på)
    //så gör anrop mot local sida som i sin tur anropar TimeEdit
    $.ajax({
        url: 'timeeditapi.php?todaysdate=' + todaysdate,
        success: function(response){
            console.log(response)
            nrofcalls++
            nobookingstoshow = true;
            //Rubriker
            jsonbookings = JSON.parse(response);
            html = '<div class="float bookingheader"><div class="eventtime">Time</div><div class="eventtitle">Event</div></div>';
            if(jsonbookings.reservations.length > 0) {
                jsonbookings.reservations.forEach(function(element) {
                    var info = '';
                    var currentdate = new Date();
                    var eventenddate = new Date();
                    eventenddate.setHours(element.endtime.substr(0,2),element.endtime.substr(3,2),0);
                    //currentdate.setHours(00,00,0);
                    
                    //visa inte om sluttiden för eventet har passerats.
                    if (eventenddate > currentdate) {
                        if(element.columns[3]!="") {
                            info = ', ' + element.columns[3];
                        }
                        html += '<div class="float bookingrow"><div class="eventtime">' + element.starttime.substr(0,5) + ' - ' + element.endtime.substr(0,5) + '</div><div class="eventtitle"> ' + element.columns[0] + info + '</div></div>';
                        nobookingstoshow = false;
                    }
                }); 
            } 
            //uppdatera html
            if(nobookingstoshow) {
                html = '<div class="float bookingheader">No bookings</div>';
            }
            $("#lokalbokningar").html(html);
            $("#sysinfo").html("ip: " + jsonbookings.properties.ipaddress + " C: " + nrofcalls);
            var refInterval = window.setTimeout('getEvents()', 5000); // 30 seconds
        },
        
        error: function(err){
            console.log(err)
            html = '<div class="float bookingheader">Error: ' + err.statusText +'</div>';
            $("#lokalbokningar").html(html);
        },
        complete: function() {
        }
    });
}

function drawClock() {
    ctx.clearRect(-150, -150, canvas.width, canvas.height);
    drawFace(ctx, radius);
    drawNumbers(ctx, radius);
    drawTime(ctx, radius);
    t2 = setTimeout(function () {
        drawClock()
    }, 1000);
}

function drawFace(ctx, radius) {
  var grad;
  //Bakgrund
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2*Math.PI);
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fill();
  grad = ctx.createRadialGradient(0,0,radius*0.95, 0,0,radius*1.05);
  grad.addColorStop(0, '#333');
  grad.addColorStop(0.5, '#fff');
  grad.addColorStop(1, '#333');
  ctx.strokeStyle = grad;
  ctx.lineWidth = radius*0.1;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, radius*0.1, 0, 2*Math.PI);
  ctx.fillStyle = '#333';
  ctx.fill();
}

function drawNumbers(ctx, radius) {
  var ang;
  var num;
  ctx.font = radius*0.15 + "px arial";
  ctx.textBaseline="middle";
  ctx.textAlign="center";
  for(num = 1; num < 13; num++){
    ang = num * Math.PI / 6;
    ctx.rotate(ang);
    ctx.translate(0, -radius*0.85);
    ctx.rotate(-ang);
    ctx.fillText(num.toString(), 0, 0);
    ctx.rotate(ang);
    ctx.translate(0, radius*0.85);
    ctx.rotate(-ang);
  }
}

function drawTime(ctx, radius){
    var now = new Date();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    hour=hour%12;
    hour=(hour*Math.PI/6)+
    (minute*Math.PI/(6*60))+
    (second*Math.PI/(360*60));
    drawHand(ctx, hour, radius*0.5, radius*0.07);

    minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
    drawHand(ctx, minute, radius*0.8, radius*0.07);

    second=(second*Math.PI/30);
    drawHand(ctx, second, radius*0.9, radius*0.02);
}

function drawHand(ctx, pos, length, width) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.moveTo(0,0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
}