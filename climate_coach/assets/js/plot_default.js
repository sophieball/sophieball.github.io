// reads data
// plots the charts that are shown when the page is load
$.getJSON("https://raw.githubusercontent.com/CMUSTRUDEL/climate_coach/main/out_mm.json", 
    function(data) {
    // display basic stats
    var num_months = data[0]["num_closed"].length;
    var unique_members = document.getElementById('unique_members');
    unique_members.innerHTML = data[3]["total_active"];
    var new_members = document.getElementById('new_members');
    new_members.innerHTML = data[3]["total_new"];
    var issue_closed = document.getElementById('issue_closed');
    issue_closed.innerHTML = data[0]["num_closed"][num_months-1];
    var pr_closed = document.getElementById('pr_closed');
    pr_closed.innerHTML = data[1]["num_closed"][num_months-1];
    var i_avg_closed_time_top = document.getElementById('i_avg_close_top');
    i_avg_closed_time_top.innerHTML = data[0]["avg_close_time"][num_months-1];
    var pr_avg_closed_time_top = document.getElementById('p_avg_close_top');
    pr_avg_closed_time_top.innerHTML = data[1]["avg_close_time"][num_months-1];
    var i_avg_comments_top = document.getElementById('i_avg_comments_top');
    i_avg_comments_top.innerHTML = data[0]["avg_comments_before_close"][num_months-1];
    var pr_avg_comments_top = document.getElementById('p_avg_comments_top');
    pr_avg_comments_top.innerHTML = data[1]["avg_comments_before_close"][num_months-1];

    // display time consuming issues
    var long_time_convs = document.getElementById('time_consuming_convs');
    long_standings = data[0].long_standing;
    console.log(long_standings);
    long_time_convs.innerHTML = "Issues that have been opened for the longest time:";
    long_standings.forEach((long_standing) => {
        long_time_convs.innerHTML += 
            '<p class="pb-1"><a href="'+long_standing.url+'">'+long_standing.title+'</a></p>';
    });

    // display issues with many rounds
    var most_comment_conv = document.getElementById('many_comments_convs');
    most_comments = data[0].most_comments;
    most_comment_conv.innerHTML = "<p>Open issues with the most comments:</p>";
    most_comments.forEach((most_comment) => {
        most_comment_conv.innerHTML += 
            '<p class="p-0"><a href="'+most_comment.url+'">'+most_comment.title+'</a></p>';
    });

    // display default charts
    issue_config = Object.assign({}, line_config);
    issue_config["data"] = {
        labels: months,
        datasets: [{
            backgroundColor: line_colors[0],
            borderColor: line_colors[0],
            fill: false,
            tension: 0,
            pointRadius: 6,
            pointHoverRadius: 8,
            data: data[0].num_new_authors,
        }]
    };
    issue_config["options"]["title"]["text"] = "New Issue Authors";
    issue_size_chart = new Chart(document.getElementById("issueSizeChart"), issue_config);

    pr_config = Object.assign({}, line_config);
    pr_config["data"] = {
        labels: months,
        datasets: [{
            backgroundColor: line_colors[0],
            borderColor: line_colors[0],
            fill: false,
            tension: 0,
            pointRadius: 6,
            pointHoverRadius: 8,
            data: data[1].num_new_authors
        }]
    };
    pr_config["options"]["title"]["text"] = "New PR Authors";
    pr_size_chart = new Chart(document.getElementById("prSizeChart"), pr_config);

    issue_label = Object.assign({}, bar_config);
    issue_label["data"] = {
        labels: data[0].label_counts_keys,
        datasets: [{
            backgroundColor: color_palette,
            borderColor: line_palette,
            borderWidth: 1,
            tension: 0,
            pointRadius: 6,
            pointHoverRadius: 8,
            data: data[0].label_counts_values
        }]
    };

    // if neither issue nor pr uses labels, make these two tabs short
    if (data[0].label_counts_values.length == 0 
        && data[1].label_counts_values.length == 0){
        label_chart_height = "70px";
    }
    else{
        label_chart_height = "300px";
    }
    var num_labels = data[0].label_counts_values.length;
    var issue_label_field = document.getElementById("issue_label_area");
    if (num_labels == 0){
        issue_label_field.innerHTML = "<div class='chart-area' style='height: "+label_chart_height+" !important;'><p class='pt-3'>Seems like you aren't using labels to manage your issues</p></div>"
    }
    else{        
        issue_label_field.innerHTML = "<div class='chart-area' style='height: "+label_chart_height+" !important;'><canvas id='issue_labels'></canvas></div>"
        new Chart(document.getElementById("issue_labels"), issue_label);
    }

    pr_label = Object.assign({}, bar_config);
    pr_label["data"] = {
        labels: data[1].label_counts_keys,
        datasets: [{
            backgroundColor: color_palette,
            borderColor: line_palette,
            borderWidth: 1,
            pointRadius: 6,
            pointHoverRadius: 8,
            data: data[1].label_counts_values
        }]
    };
    var pr_num_labels = data[1].label_counts_values.length;
    var pr_label_field = document.getElementById("pr_label_area");
    if (pr_num_labels == 0){
        pr_label_field.innerHTML = "<div class='chart-area' style='height: "+label_chart_height+" !important;'><p class='pt-3'>Seems like you aren't using labels to manage your pull requests</p></div>"
    }
    else{
        pr_label_field.innerHTML = "<div class='chart-area' style='height: "+label_chart_height+" !important;'><canvas id='PR_labels'></canvas></div>"
        new Chart(document.getElementById("PR_labels"), pr_label);
    }

    issue_time = Object.assign({}, line_config);
    issue_time["data"] = {
        labels: months,
        datasets: [{
            backgroundColor: line_colors[1],
            borderColor: line_colors[1],
            fill: false,
            tension: 0,
            pointRadius: 6,
            pointHoverRadius: 8,
            data: data[0].avg_close_time
        }]
    };
    issue_time["options"]["title"]["text"] = "Average Close Time for Issues (Days)";
    issue_time_chart = new Chart(document.getElementById("issueTimeChart"), issue_time);

    pr_time = Object.assign({}, line_config);
    pr_time["data"] = {
        labels: months,
        datasets: [{
            backgroundColor: line_colors[1],
            borderColor: line_colors[1],
            fill: false,
            tension: 0,
            pointRadius: 6,
            pointHoverRadius: 8,
            data: data[1].avg_close_time
        }]
    };
    pr_time["options"]["title"]["text"] = "Average Close Time for Pull Requests (Days)";
    pr_time_chart = new Chart(document.getElementById("prTimeChart"), pr_time);


    issue_dis = Object.assign({}, line_config);
    issue_dis["data"] = {
        labels: months,
        datasets: [{
            backgroundColor: line_colors[2],
            borderColor: line_colors[2],
            fill: false,
            tension: 0,
            pointRadius: 6,
            pointHoverRadius: 8,
            data: data[0].avg_comments_before_close
        }]
    };
    issue_dis["options"]["title"]["text"] = "Average Comments for Issues Closed in Each Month";
    issue_dicussion_chart = new Chart(document.getElementById("issueDisChart"), issue_dis);

    pr_dis = Object.assign({}, line_config);
    pr_dis["data"] = {
        labels: months,
        datasets: [{
            backgroundColor: line_colors[2],
            borderColor: line_colors[2],
            fill: false,
            tension: 0,
            pointRadius: 6,
            pointHoverRadius: 8,
            data: data[1].avg_comments_before_close
        }]
    };
    pr_dis["options"]["title"]["text"] = "Average Comments for Pull Requests Closed in Each Month";
    pr_dicussion_chart = new Chart(document.getElementById("prDisChart"), pr_dis);

    toxic_config = Object.assign({}, line_config);
    toxic_config["data"] = {
        labels: months,
        datasets: [{
            // label: title,
            backgroundColor: line_colors[3],
            borderColor: line_colors[3],
            fill: false,
            tension: 0,
            pointRadius: 6,
            data: data[0].num_toxic
        }]
    };
    toxic_config["options"]["title"]["text"] = "Number of Potentially Problematic Issues";
    toxic_chart = new Chart(document.getElementById("toxicity_info"), toxic_config);

    var toxic_score = document.getElementById("highest_toxic");
    toxic_score.innerHTML = data[0].max_toxic[data[0].max_toxic.length - 1];
    var attack_score = document.getElementById("highest_attack");
    attack_score.innerHTML = data[0].max_attack[data[0].max_attack.length - 1];

    var toxic_list = document.getElementById('toxic_links');
    toxic_links = data[0].toxic[5].slice(1, num_toxic_to_show);
    toxic_list.innerHTML = "";
    var toxic_count = 1;
    toxic_links.forEach((toxic_link) => {
        toxic_list.innerHTML += 
            '<p class="m-0"><a href="'+toxic_link.url+'">'+String(toxic_count)+". "+toxic_link.title+'</a></p>';
        toxic_count = toxic_count + 1;
    });

    // display negative sentiment conversations
    var neg_list = document.getElementById('neg_senti_links');
    neg_links = data[0].neg_senti[5].slice(1, num_toxic_to_show);
    console.log(neg_links);
    neg_list.innerHTML = "";
    var neg_count = 1;
    neg_links.forEach((neg_link) => {
        neg_list.innerHTML += 
            '<p class="m-0"><a href="'+neg_link.url+'">'+String(neg_count)+". "+neg_link.title+'</a></p>';
        neg_count += 1;
    });


    compare_config_d = Object.assign({}, bar_config);
    compare_config_d["data"] = {
            labels: projects_for_comparison,
            datasets: [{
                data: [5, 7, 8, 2, 9],
                backgroundColor: color_palette,
                borderColor: line_palette,
                borderWidth: 1
            }]
        };
    compare_config_d["options"]["title"]["text"] = "Active Authors (Issues and Pull Requests)";
    compareChart = new Chart(comp, compare_config_d);

    // print new contributors' logins
    displayList(data);

    createGraphs(data);

    listConvers(data);

    displayToxic(data);
}); 