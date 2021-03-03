class Project {

    name;
    description; 
    status; // Completed, Work in Progress, On Hold
    link; // href to project hosted site
    link_header; // e.g. "Play" or "View" Now
    link_note; // e.g. (expect audio)
    github_link; // href to project github repo
    github_readme; // boolean
    notes = [];
    thumbnail = {
        
        btn_id: null,
        src: null,
        alt: null,
    }; // main image displayed in gallery
    carousel_img_list = {

        id: [],
        src: [],
        alt: [],
    };
    tool_icon_list = {

        id: [],
        src: [],
        alt: [],
    }; // i.e. to be added to the "- Built Using -" icon section

    constructor(name, status, link, link_header, github_link, github_readme)
    {
        if(status === 1) {

            this.status = "Completed";
        } else if(status === 2) {

            this.status = "Work in Progress";
        } else if(status === 3) {

            this.status = "On Hold";
        };
        
        if(github_readme === true) {

            github_readme = "(GitHub - readme available)";
        } else {

            github_readme = "(GitHub)";
        };
        
        this.name = name;
        this.status = status;
        this.link = link;
        this.link_header = link_header;
        this.github_link = github_link;
        this.github_readme = github_readme;
    };

    add_imgs(id, src, alt) {

        this.carousel_img_list.id.push(...id);
        this.carousel_img_list.src.push(...src);
        this.carousel_img_list.alt.push(...alt);
    };

    add_tool_icons(id, src, alt) {

        this.tool_icon_list.id.push(...id);
        this.tool_icon_list.src.push(...src);
        this.tool_icon_list.alt.push(...alt);
    };
};

export default Project;