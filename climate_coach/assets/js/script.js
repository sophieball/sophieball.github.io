const line_color = 'rgb(2, 117, 216)';
const dot_color = 'rgb(39, 15, 163)';
// for big projects, we can't fit the entire list of problematic conversations
const num_toxic_to_show = 6;
// the list of projects to compare. CHANGE THIS
const projects_for_comparison = [
              'Your project',
              'monarch-initiative/mondo',
              'EBISPOT/OLS',
              'monarch-initiative/MAxO',
              'biolink/kgx'];

// declare charts
var compareChart;
var toxic_chart;
var pr_dicussion_chart;
var issue_dicussion_chart;
var pr_time_chart;
var issue_time_chart;
var pr_size_chart;
var issue_size_chart;

// decide what conversations to display
// 0: issue. 1: pr
var toxic_conv_type = 0;
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
    authorListSelector = document.querySelectorAll(".authorList");
    authorListSelector.forEach((selector) =>
    selector.addEventListener('click', (event) => {
        switch (selector.id) {
        case "new_issue_authors":
            title = "Issues";
            people = data[0].new_authors;
            new_member = document.getElementById('new_members_list');
            new_member.innerHTML = '<p class="m-0">'+title+'</p>';
            if (people.length > 0){
                people.forEach((person) => {
                    new_member.innerHTML += 
                        '<a class="m-0" href="http://www.github.com/'+person+'">'+person+'</a><br>';
                });
            }
            break;
        case "new_pr_authors":
            title = "PRs";
            people = data[1].new_authors;
            new_member = document.getElementById('new_members_list');
            new_member.innerHTML = '<p class="m-0">'+title+'</p>';
            if (people.length > 0){
                people.forEach((person) => {
                    new_member.innerHTML += 
                        '<a class="m-0" href="http://www.github.com/'+person+'">'+person+'</a><br>';
                });
            }
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
                        '<p class="p-0"><a href="'+most_comment.url+'">'+most_comment.title+'</a></p>';
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
const comp = document.getElementById('Compare');

function createGraphs(data) {
    issueSizeChartSelects.forEach((selector) =>
    selector.addEventListener('click', (event) => {
        drawChart(data, selector, "issueSizeChart", issue_size_chart);
    }));
    prSizeChartSelects.forEach((selector) =>
    selector.addEventListener('click', (event) => {
        drawChart(data, selector, "prSizeChart", pr_size_chart);
    }));


    issueTimeChartSelects.forEach((selector) =>
    selector.addEventListener('click', (event) => {
        drawChart(data, selector, "issueTimeChart", issue_time_chart);
    }));
    prTimeChartSelects.forEach((selector) =>
    selector.addEventListener('click', (event) => {
        drawChart(data, selector, "prTimeChart", pr_time_chart);
    }));

    issueDisChartSelects.forEach((selector) =>
    selector.addEventListener('click', (event) => {
        drawChart(data, selector, "issueDisChart", issue_dicussion_chart);
    }));
    prDisChartSelects.forEach((selector) =>
    selector.addEventListener('click', (event) => {
        drawChart(data, selector, "prDisChart", pr_dicussion_chart);
    }));

    toxicSelect.forEach((selector) =>
    selector.addEventListener('click', (event) => {
        drawChart(data, selector, "toxicity_info", toxic_chart);
    }));

    compareListSelect.forEach((selector) =>
    selector.addEventListener('click', (event) => {
        drawCompareChart(data, selector, "Compare");
    }));
}

// drop down
function drawCompareChart(data, selector, chart_id){
    switch (selector.id) {
        case "comp_num_active":
            title = "Active Authors (past month)";
            metric = [2, 6, 0, 1, 2];
            xtitle = projects_for_comparison;
            break;
        case "comp_i_closed":
            title = "Number of Issues Closed (past month)";
            metric = [14, 46, 9, 5, 2];
            xtitle = projects_for_comparison;
            break;
        case "comp_p_closed":
            title = "Number of PRs Closed (past month)";
            metric = [8, 72, 0, 5, 2];
            xtitle = projects_for_comparison;
            break;
        // case "comp_i_time":
        //     title = "Average Time before Closing Issues";
        //     metric = [0, 0, 0, 0, 0];
        //     xtitle = [
        //       'Your project',
        //       'github.com/CeresDB/ceresdb',
        //       'github.com/ivadomed/ivadomed',
        //       'github.com/smistad/FAST',
        //       'github.com/pygments/pygment'];
        //     break;
        // case "comp_p_time":
        //     title = "Average Time before Closing PRs";
        //     metric = [0, 0, 0, 0, 0];
        //     xtitle = [
        //       'Your project',
        //       'github.com/CeresDB/ceresdb',
        //       'github.com/ivadomed/ivadomed',
        //       'github.com/smistad/FAST',
        //       'github.com/pygments/pygment'];
        //     break;
        default:
            break;
    }

    compare_config = Object.assign({}, bar_config);
    compare_config["data"] = {
        labels: xtitle,
        datasets: [{
            backgroundColor: color_palette,
            borderColor: line_palette,
            borderWidth: 1,
            tension: 0,
            pointRadius: 6,
            pointHoverRadius: 8,
            data: metric
        }]
    };
    compare_config["options"]["title"]["text"] = title;

    compareChart.destroy();
    compareChart = new Chart(comp, compare_config);
}

function drawChart(data, selector, chart_id, chart_obj)
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
            metric = data[0].num_new_authors;
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
            metric = data[1].num_new_authors;
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
            toxic_links = data[0].toxic[5].slice(1, num_toxic_to_show);
            toxic_list.innerHTML = "";
            toxic_count = 1;
            toxic_links.forEach((toxic_link) => {
                toxic_list.innerHTML += 
                    '<p class="m-0"><a href="'+toxic_link.url+'">'+String(toxic_count)+". "+toxic_link.title+'</a></p>';
                toxic_count += 1;
            });

            // display negative sentiment conversations
            var neg_list = document.getElementById('neg_senti_links');
            neg_links = data[0].neg_senti[5].slice(1, num_toxic_to_show);
            neg_list.innerHTML = "";
            neg_count = 1;
            neg_links.forEach((neg_link) => {
                neg_list.innerHTML += 
                    '<p class="m-0"><a href="'+neg_link.url+'">'+String(neg_count)+". "+neg_link.title+'</a></p>';
                neg_count += 1;
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
            toxic_links = data[1].toxic[5].slice(1, num_toxic_to_show);
            toxic_list.innerHTML = "";
            toxic_count = 1;
            toxic_links.forEach((toxic_link) => {
                toxic_list.innerHTML += 
                    '<p class="m-0><a href="'+toxic_link.url+'">'+String(toxic_count)+". "+toxic_link.title+'</a></p>';
                toxic_count += 1;
            });


            // display negative sentiment conversations
            var neg_list = document.getElementById('neg_senti_links');
            neg_links = data[1].neg_senti[5].slice(1, num_toxic_to_show);
            neg_list.innerHTML = "";
            neg_count = 1;
            neg_links.forEach((neg_link) => {
                neg_list.innerHTML += 
                    '<p class="m-0"><a href="'+neg_link.url+'">'+String(neg_count)+". "+neg_link.title+'</a></p>';
                neg_count += 1;
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

    chart_obj.destroy();
    chart_obj = new Chart(
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
        var toxic_score = document.getElementById("highest_toxic");
        toxic_score.innerHTML = data[toxic_conv_type].max_toxic[month];
        var attack_score = document.getElementById("highest_attack");
        attack_score.innerHTML = data[toxic_conv_type].max_attack[month];

        var toxic_list = document.getElementById('toxic_links');
        toxic_links = data[toxic_conv_type].toxic[month].slice(1, num_toxic_to_show);
        toxic_list.innerHTML = "";
        toxic_count = 1;
        toxic_links.forEach((toxic_link) => {
            toxic_list.innerHTML += 
                '<p class="m-0"><a href="'+toxic_link.url+'">'+String(toxic_count)+". "+toxic_link.title+'</a></p>';
            toxic_count += 1;
        });

        // display negative sentiment conversations
        var neg_list = document.getElementById('neg_senti_links');
        neg_links = data[toxic_conv_type].neg_senti[month].slice(1, num_toxic_to_show);
        neg_list.innerHTML = "";
        neg_count = 1;
        neg_links.forEach((neg_link) => {
            neg_list.innerHTML += 
                '<p class="m-0"><a href="'+neg_link.url+'">'+String(neg_count)+". "+neg_link.title+'</a></p>';
            neg_count += 1;
        });
    })});
}
