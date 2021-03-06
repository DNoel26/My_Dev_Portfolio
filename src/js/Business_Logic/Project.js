class Project {
    name;
    description;
    status = {
        msg: null, // Completed, Work in Progress, On Hold
        class_code: null,
    };
    link; // href to project hosted site
    link_header; // e.g. "Play" or "View" Now
    link_note; // e.g. (expect audio)
    github_link; // href to project github repo
    github_readme; // boolean
    notes = []; // displayed as an unordered list
    thumbnail = {
        btn_id: null,
        src: null,
        alt: null,
    }; // main button image displayed in gallery above project overview
    carousel_img_list = {
        ids: [],
        srcs: [],
        alts: [],
    }; // images to be displayed in the carousel
    tool_icon_list = {
        ids: [],
        srcs: [],
        alts: [],
    }; // i.e. to be added to the "- Built Using -" icon section

    constructor(name, status_msg, link, link_header, github_link, github_readme) {
        if (status_msg === 1) {
            status_msg = 'Completed';
            this.status.class_code = 'status-complete';
        } else if (status_msg === 2) {
            status_msg = 'Work in Progress';
            this.status.class_code = 'status-in-progress';
        } else if (status_msg === 3) {
            status_msg = 'On Hold';
            this.status.class_code = 'status-hold';
        }
        if (github_readme === true) {
            github_readme = '(GitHub - readme available)';
        } else {
            github_readme = '(GitHub)';
        }
        this.name = name;
        this.status.msg = status_msg;
        this.link = link;
        this.link_header = link_header;
        this.github_link = github_link;
        this.github_readme = github_readme;
    }

    add_imgs(ids, srcs, alts) {
        this.carousel_img_list.ids.push(...ids);
        this.carousel_img_list.srcs.push(...srcs);
        this.carousel_img_list.alts.push(...alts);
    }
    add_tool_icons(ids, srcs, alts) {
        this.tool_icon_list.ids.push(...ids);
        this.tool_icon_list.srcs.push(...srcs);
        this.tool_icon_list.alts.push(...alts);
    }
}

export default Project;
