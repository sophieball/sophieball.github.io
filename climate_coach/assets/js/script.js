const line_color = 'rgb(2, 117, 216)';
const dot_color = 'rgb(39, 15, 163)';
var toxic_conv_type = 0; // decide what conversations to display
var colors = [
                    'rgb(42, 49, 149, 0.7)',
                    'rgb(169, 53, 131, 0.7)',
                    'rgb(218, 51, 97, 0.7)',
                    'rgb(246, 93, 78, 0.7)',
                    'rgb(243, 153, 67, 0.7)',
                    'rgb(238, 215, 63, 0.7)'
                ];
var line_colors = [
    'rgb(42, 49, 149)',
    'rgb(169, 53, 131)',
    'rgb(218, 51, 97)',
    'rgb(246, 93, 78)',
    'rgb(243, 153, 67)',
    'rgb(238, 215, 63)'
];
const color_palette = colors.concat(colors);
const line_palette = line_colors.concat(line_colors);
var title;
var metric;
const line_config = {
  type: 'line',
  options: {
    maintainAspectRatio: false,
    responsive: true,
    legend: {
        display: false,
    },
    title: {
        display: true,
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          callback: function(value) {if (value % 1 === 0) {return value;}}
        }
      }]
    } 
  },
};

const bar_config = {
  type: 'bar',
  fillOpacity: .3,
  options: {
    maintainAspectRatio: false,
    responsive: true,
    legend: {
        display: false,
    },
    title: {
        display: true,
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          callback: function(value) {if (value % 1 === 0) {return value;}}
        }
      }]
    } 
  },
};

const months = [
    'December',
    'January',
    'February',
    'March',
    'April',
    'May',
];

function displayList(data) {
    title = "Issues";
    people = data[0].new_authors;
    new_member = document.getElementById('new_members_list');
    new_member.innerHTML = '<p class="m-0">'+title+'</p>';
    if (people.length > 0){
        people.forEach((person) => {
            new_member.innerHTML += 
                '<a class="m-0" href="http://www.github.com/'+person+'">'+person+'</a>&emsp;';
        });
    }

    authorListSelector = document.querySelectorAll(".authorList");
    authorListSelector.forEach((selector) =>
    selector.addEventListener('click', (event) => {
        switch (selector.id) {
        case "new_issue_authors":
            title = "New Issue Authors";
            people = data[0].new_authors;
            new_member = document.getElementById('new_members_list');
            new_member.innerHTML = '<p>'+title+'</p>';
            people.forEach((person) => {
                new_member.innerHTML += 
                    '<a class="m-0" href="http://www.github.com/'+person+'">'+person+'</a>&emsp;';
            });
            break;
        case "new_pr_authors":
            title = "New PR Authors";
            people = data[1].new_authors;
            new_member = document.getElementById('new_members_list');
            new_member.innerHTML = "<h6>"+title+"</h6>";
            people.forEach((person) => {
                new_member.innerHTML += 
                    '<a class="m-0" href="http://www.github.com/'+person+'">'+person+'</a>&emsp;';
            });
            break;
        default:
            break;
        }

        
    }));   
}

const timeListSelects = document.querySelectorAll(".timeList");
const commentListSelects = document.querySelectorAll(".commentList");
function listConvers(data) {
    // Display links to conversations
    timeListSelects.forEach((selector) =>
    selector.addEventListener('click', (event) => {
        switch (selector.id) {
            case "i_long_time":
                var long_time_convs = document.getElementById('time_consuming_convs');
                long_standings = data[0].long_standing;
                long_time_convs.innerHTML = "Issues that have been opened for the longest time:";
                long_standings.forEach((long_standing) => {
                    long_time_convs.innerHTML += 
                        '<p class="pb-1"><a href="'+long_standing.url+'">'+long_standing.title+'</a></p>';
                });
                break;
            case "p_long_time":
                var long_time_convs = document.getElementById('time_consuming_convs');
                console.log(long_standings);
                long_standings = data[1].long_standing;
                long_time_convs.innerHTML = "Pull requests  that have been opened for the longest time:";
                long_standings.forEach((long_standing) => {
                    long_time_convs.innerHTML += 
                        '<p class="pb-1"><a href="'+long_standing.link+'">'+long_standing.title+'</a></p>';
                });
                break;
            default:
                break;
        }
    }));

    commentListSelects.forEach((selector) =>
    selector.addEventListener('click', (event) => {
        switch (selector.id) {
            case "i_most_comments":
                var most_comment_conv = document.getElementById('many_comments_convs');
                most_comments = data[0].most_comments;
                most_comment_conv.innerHTML = "<p>Open issues with the most comments:</p>";
                most_comments.forEach((most_comment) => {
                    most_comment_conv.innerHTML += 
                        '<p class="pb-1"><a href="'+most_comment.url+'">'+most_comment.title+'</a></p>';
                });
                break;
            case "p_most_comments":
                var most_comment_conv = document.getElementById('many_comments_convs');
                console.log(long_standings);
                most_comments = data[1].most_comments;
                most_comment_conv.innerHTML = "<p>Open pull requests with the most comments:</p>";
                most_comments.forEach((most_comment) => {
                    most_comment_conv.innerHTML += 
                        '<p class="pb-1"><a href="'+most_comment.url+'">'+most_comment.title+'</a></p>';
                });
                break;
            default:
                break;
        }
    }));
}



const issueSizeChartSelects = document.querySelectorAll(".issueSizeChartSelect");
const prSizeChartSelects = document.querySelectorAll(".prSizeChartSelect");
const issueTimeChartSelects = document.querySelectorAll(".issueTimeChartSelect");
const prTimeChartSelects = document.querySelectorAll(".prTimeChartSelect");
const issueDisChartSelects = document.querySelectorAll(".issueDisChartSelect");
const prDisChartSelects = document.querySelectorAll(".prDisChartSelect");
const toxicSelect = document.querySelectorAll(".toxicityList");
const compareListSelect = document.querySelectorAll(".compareList");

function createGraphs(data) {
    issueSizeChartSelects.forEach((selector) =>
    selector.addEventListener('click', (event) => {
        drawChart(data, selector, "issueSizeChart");
    }));
    prSizeChartSelects.forEach((selector) =>
    selector.addEventListener('click', (event) => {
        drawChart(data, selector, "prSizeChart");
    }));


    issueTimeChartSelects.forEach((selector) =>
    selector.addEventListener('click', (event) => {
        drawChart(data, selector, "issueTimeChart");
    }));
    prTimeChartSelects.forEach((selector) =>
    selector.addEventListener('click', (event) => {
        drawChart(data, selector, "prTimeChart");
    }));

    issueDisChartSelects.forEach((selector) =>
    selector.addEventListener('click', (event) => {
        drawChart(data, selector, "issueDisChart");
    }));
    prDisChartSelects.forEach((selector) =>
    selector.addEventListener('click', (event) => {
        drawChart(data, selector, "prDisChart");
    }));

    toxicSelect.forEach((selector) =>
    selector.addEventListener('click', (event) => {
        drawChart(data, selector, "toxicity_info");
    }));

    const comp = document.getElementById('Compare');
    compare_config = Object.assign({}, bar_config);
    compare_config["data"] = {
            labels: ['Your project', 'payloadcms/payload'],
            datasets: [{
                // label: '# of Votes',
                data: [1, 28],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        };
    compare_config["options"]["title"]["text"] = "Active Authors (Issues and Pull Requests)";
    const Compare = new Chart(comp, compare_config);

    compareListSelect.forEach((selector) =>
    selector.addEventListener('click', (event) => {
        drawChart(data, selector, "Compare");
    }));
}

function drawChart(data, selector, chart_id)
{
    switch (selector.id) {
        case "u_i_active":
            title = "Active Issue Authors";
            metric = data[0].num_unique_authors;
            xtitle = months;
            cur_colour = line_colors[0];
            break;
        case "n_i_active":
            title = "New Issue Authors";
            metric = data[0].num_new_users;
            xtitle = months;
            cur_colour = line_colors[0];
            break;
        case "u_p_active":
            title = "Active Pull Request Authors";
            metric = data[1].num_unique_authors;
            xtitle = months;
            cur_colour = line_colors[0];
            break;
        case "n_p_active":
            title = "New Pull Request Authors";
            metric = data[1].num_new_users;
            xtitle = months;
            cur_colour = line_colors[0];
            break;
        case "i_new":
            title = "Number of New Issues";
            metric = data[0].num_open;
            xtitle = months;
            cur_colour = line_colors[0];
            break;
        
        case "p_new":
            title = "Number of New Pull Requests";
            metric = data[1].num_open;
            xtitle = months;
            cur_colour = line_colors[0];
            break;
        case "i_closed":
            title = "Number of Issues Closed";
            metric = data[0].num_closed;
            xtitle = months;
            cur_colour = line_colors[0];
            break;
        case "p_closed":
            title = "Number of Pull Requests Closed";
            metric = data[1].num_closed;
            xtitle = months;
            cur_colour = line_colors[0];
            break;
        case "i_types":
            title = "Number of Issues by Label (in the past month)";
            metric = data[0].label_counts_values;
            xtitle = data[0].label_counts_keys;
            cur_colour = line_colors[0];
            break;
        case "p_types":
            title = "Number of Pull Requests by Label (in the past month)";
            metric = data[1].label_counts_values;
            xtitle = data[1].label_counts_keys;
            cur_colour = line_colors[0];
            break;
        case "i_close_time":
            title = "Median Time for Closing Issues (Days)";
            metric = data[0].median_close_time;
            xtitle = months;
            cur_colour = line_colors[1];
            break;
        case "i_avg_close_time":
            title = "Average Time for Closing Issues (Days)";
            metric = data[0].avg_close_time;
            xtitle = months;
            cur_colour = line_colors[1];
            break;
        case "p_close_time":
            title = "Median Time for Closing Pull Requests";
            metric = data[1].median_close_time;
            xtitle = months;
            cur_colour = line_colors[1];
            break;
        case "p_avg_close_time":
            title = "Average Time for Closing Pull Requests";
            metric = data[1].avg_close_time;
            xtitle = months;
            cur_colour = line_colors[1];
            break;
        case "i_closed_comments":
            title = "Median Comments for Issues Closed in Each Month";
            metric = data[0].median_comments_before_close;
            xtitle = months;
            cur_colour = line_colors[2];
            break;
        case "i_avg_closed_comments":
            title = "Average Comments for Issues Closed in Each Month";
            metric = data[0].avg_comments_before_close;
            xtitle = months;
            cur_colour = line_colors[2];
            break;
        case "p_closed_comments":
            title = "Median Comments for Pull Requests Closed in Each Month";
            metric = data[1].median_comments_before_close;
            xtitle = months;
            cur_colour = line_colors[2];
            break;
        case "p_avg_closed_comments":
            title = "Average Comments for Pull Requests Closed in Each Month";
            metric = data[1].avg_comments_before_close;
            xtitle = months;
            cur_colour = line_colors[2];
            break;
        case "i_open_comments":
            title = "Median Comments for Issues Opened in Each Month";
            metric = data[0].median_comments_recent;
            xtitle = months;
            cur_colour = line_colors[2];
            break;
        case "i_avg_open_comments":
            title = "Average Comments for Issues Opened in Each Month";
            metric = data[0].avg_comments_recent;
            xtitle = months;
            cur_colour = line_colors[2];
            break;
        case "p_open_comments":
            title = "Median Comments for Pull Requests Opened in Each Month";
            metric = data[1].median_comments_recent;
            xtitle = months;
            cur_colour = line_colors[2];
            break;
        case "p_avg_open_comments":
            title = "Average Comments for Pull Requests Opened in Each Month";
            metric = data[1].avg_comments_recent;
            xtitle = months;
            cur_colour = line_colors[2];
            break;
        case "i_0_comments":
            title = "Number of Issues Closed with 0 Comments";
            metric = data[0].num_closed_0_comments;
            xtitle = months;
            cur_colour = line_colors[2];
            break;
        case "p_0_comments":
            title = "Number of Pull Requests Closed with 0 Comments";
            metric = data[1].num_closed_0_comments;
            xtitle = months;
            cur_colour = line_colors[2];
            break;
        case "toxic_issues":
            title = "Number of Potentially Problematic Issues";
            metric = data[0].num_toxic;
            xtitle = months;
            cur_colour = line_colors[3];
            toxic_conv_type = 0;

            var toxic_score = document.getElementById("highest_toxic");
            toxic_score.innerHTML = data[0].max_toxic[0];
            var attack_score = document.getElementById("highest_attack");
            attack_score.innerHTML = data[0].max_attack[data[0].max_attack.length - 1];

            var toxic_list = document.getElementById('toxic_links');
            toxic_links = data[0].toxic[data[0].num_toxic.length - 1];
            console.log(toxic_list);
            toxic_list.innerHTML = "";
            toxic_links.forEach((toxic_link) => {
                toxic_list.innerHTML += 
                    '<p class="m-0"><a href="'+toxic_link.url+'">'+toxic_link.title+'</a></p>';
            });

            // display negative sentiment conversations
            var neg_list = document.getElementById('neg_senti_links');
            neg_links = data[0].neg_senti[data[0].neg_senti.length - 1];
            console.log(neg_list);
            neg_list.innerHTML = "";
            neg_links.forEach((neg_link) => {
                neg_list.innerHTML += 
                    '<p class="m-0"><a href="'+neg_link.url+'">'+neg_link.title+'</a></p>';
            });

            break;
        case "toxic_prs":
            title = "Number of Potentially Problematic Pull Requests";
            metric = data[1].num_toxic;
            xtitle = months;
            cur_colour = line_colors[3];
            toxic_conv_type = 1;

            var toxic_score = document.getElementById("highest_toxic");
            toxic_score.innerHTML = data[1].max_toxic[data[1].max_toxic.length - 1];
            var attack_score = document.getElementById("highest_attack");
            attack_score.innerHTML = data[1].max_attack[data[1].max_attack.length - 1];

            var toxic_list = document.getElementById('toxic_links');
            toxic_links = data[1].toxic[data[1].num_toxic.length - 1];
            console.log(toxic_list);
            toxic_list.innerHTML = "";
            toxic_links.forEach((toxic_link) => {
                toxic_list.innerHTML += 
                    '<p class="m-0><a href="'+toxic_link.url+'">'+toxic_link.title+'</a></p>';
            });


            // display negative sentiment conversations
            var neg_list = document.getElementById('neg_senti_links');
            neg_links = data[1].neg_senti[data[1].neg_senti.length - 1];
            console.log(neg_list);
            neg_list.innerHTML = "";
            neg_links.forEach((neg_link) => {
                neg_list.innerHTML += 
                    '<p class="m-0"><a href="'+neg_link.url+'">'+neg_link.title+'</a></p>';
            });
            break;
        default:
            // title = "Active Members";
            // metric = data[0].num_unique_authors;
            // xtitle = months;
            break;
            
    }

    line_config["data"] = {
        labels: xtitle,
        datasets: [{
            label: title,
            backgroundColor: cur_colour,//'rgb(39, 15, 163)',
            borderColor: cur_colour,//line_color,
            fill: false,
            tension: 0,
            pointRadius: 6,
            pointHoverRadius: 8,
            data: metric
        }]
    };
    line_config["options"]["title"]["text"] = title;

    var myChart = new Chart(
        document.getElementById(chart_id), line_config);
}


function displayToxic(data, type){
    const toxicMonthSelect = document.querySelectorAll(".toxic_month_selector");
    var month = 5;
    toxicMonthSelect.forEach(function (selector){
        selector.addEventListener('click', (event) => {

        var button_t = document.getElementById("6");
        button_t.classList.remove("active");
        button_t = document.getElementById("5");
        button_t.classList.remove("active");
        button_t = document.getElementById("4");
        button_t.classList.remove("active");
        button_t = document.getElementById("3");
        button_t.classList.remove("active");
        button_t = document.getElementById("2");
        button_t.classList.remove("active");
        button_t = document.getElementById("1");
        button_t.classList.remove("active");
        
        switch (selector.id) {
            case "6":
                month = 0;
                break;
            case "5":
                month = 1;
                break;
            case "4":
                month = 2;
                break;
            case "3":
                month = 3;
                break;
            case "2":
                month = 4;
                break;
            case "1":
                month = 5;
                break;
            default:
                month = 5;
                break;
        }
        console.log(month);
        var toxic_score = document.getElementById("highest_toxic");
        toxic_score.innerHTML = data[toxic_conv_type].max_toxic[month];
        var attack_score = document.getElementById("highest_attack");
        attack_score.innerHTML = data[toxic_conv_type].max_attack[month];

        var toxic_list = document.getElementById('toxic_links');
        toxic_links = data[toxic_conv_type].toxic[month];
        console.log(toxic_list);
        toxic_list.innerHTML = "";
        toxic_links.forEach((toxic_link) => {
            toxic_list.innerHTML += 
                '<p class="m-0"><a href="'+toxic_link.url+'">'+toxic_link.title+'</a></p>';
        });

        // display negative sentiment conversations
        var neg_list = document.getElementById('neg_senti_links');
        neg_links = data[toxic_conv_type].neg_senti[month];
        console.log(neg_links);
        neg_list.innerHTML = "";
        neg_links.forEach((neg_link) => {
            neg_list.innerHTML += 
                '<p class="m-0"><a href="'+neg_link.url+'">'+neg_link.title+'</a></p>';
        });
    })});
}
