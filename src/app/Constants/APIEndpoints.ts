export class APIEndpoints{
    // Main  endpoint
    public static END_POINT = "http://localhost:8080/api"

    //PROFILE CONTROLLER APIS

    public static ALL_PROFESSION = APIEndpoints.END_POINT+'/medsol/profile/profession/all';
    public static GRADE_BY_PROFESSION=APIEndpoints.END_POINT+'/medsol/profile/grade/';
    public static ALL_SPECIALIZATION=APIEndpoints.END_POINT+'/medsol/profile/spec/all';
    public static SUB_SPEC_BY_SPEC = APIEndpoints.END_POINT+'/medsol/profile/subSpec/';

    //USER CONTROLLER APIS
    public static LOGIN_USER= APIEndpoints.END_POINT+"/medsol/v1/login";
    public static REGISTER_USER = APIEndpoints.END_POINT+"/medsol/v1/register";
    public static CREATE_PROFILE = APIEndpoints.END_POINT+"/medsol/v1/profile/create/";
    public static UPLOAD_PROFILE_PICTURE = APIEndpoints.END_POINT+"/medsol/v1/upload/profilePic/";
    public static GET_PROFILE_PICTURE=APIEndpoints.END_POINT+"/profilePic/";
    public static UPDATE_PROFILE_DETAILS = APIEndpoints.END_POINT+"/update/profile/";
    public static RESET_PASSWORD = APIEndpoints.END_POINT+"/update/password/";
    public static SEARCH_USER = APIEndpoints.END_POINT+"/medsol/v1/user/findBy/"
    public static PROFILE = APIEndpoints.END_POINT+"/medsol/v1/profile/";


    // UPLOAD POST
    public static UPLOAD_POST = APIEndpoints.END_POINT+'/medsol/posts/';
    public static GET_UPLOAD_POST = APIEndpoints.END_POINT+'/medsol/posts/';

    //FOLLOW CONTROLLER APIS
    public static SUGGETIONS = APIEndpoints.END_POINT+"/user/";
    public static FOLLOW = APIEndpoints.END_POINT+"/user/";
    public static GET_ALL_FOLLOWER = APIEndpoints.END_POINT+"/user/";
    public static GET_ALl_FOLLOWING = APIEndpoints.END_POINT+"/user/following/";


    // LIKE CONTROLLER API
    public static CLICK_LIKE = APIEndpoints.END_POINT+"/medsol/like/";
    public static CLICK_UN_LIKE = APIEndpoints.END_POINT+"/medsol/unLike/";

    // COMMENT CONTROLLER API
    public static POST_COMMENT = APIEndpoints.END_POINT+"/medsol/comment/create";
    

}