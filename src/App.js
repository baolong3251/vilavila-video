import React, { useEffect } from "react";
import { Switch, Route } from 'react-router-dom';
import './App.scss';
import { useDispatch } from "react-redux";
import { checkUserSession } from "./redux/User/user.action";

// HOC
import WithAuth from "./hoc/withAuth"
import WithAdminAuth from "./hoc/withAdminAuth"

// PAGES

import HomepageLayout from './layouts/HomepageLayout';
import MainLayout from './layouts/MainLayout';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Registration from "./pages/Registration";
import Search from "./pages/Search";
import UploadVideo from "./pages/UploadVideo";
import UploadImage from "./pages/UploadImage";
import Video from "./pages/Video";
import VideoLayout from "./layouts/VideoLayout";
import User from "./pages/User";
import UserLayout from "./layouts/UserLayout";
import UserVideos from "./pages/UserVideos";
import UserTiers from "./pages/UserTiers";
import UserEditVideo from "./components/UserEditVideo";
import UserEditImage from "./components/UserEditImage";
import UserImages from "./pages/UserImages";
import Point from "./pages/Point";
import Image from "./pages/Image";
import ImageLayout from "./layouts/ImageLayout";
import Videos from "./pages/Videos";
import Images from "./pages/Images";
// import AdminToolbar from "./components/AdminToolbar";
import AdminLayout from "./layouts/AdminLayout";
import Admin from "./pages/Admin";
import AdminCategory from "./components/AdminCategory";
import AdminReport from "./components/AdminReport";
import AdminAccount from "./components/AdminAccount";
import GetPoint from "./components/PointLayout/GetPoint.jsx";
import UserPrivateContents from "./pages/UserPrivateContents";
import UserContentLiked from "./pages/UserContentLiked";
import UserContentSaved from "./pages/UserContentSaved";
import SuccessPage from "./components/PointLayout/SuccessPage";
import GetMoneyFromPoint from "./components/PointLayout/GetMoneyFromPoint";
import AdminExchange from "./components/AdminExchange";
import Rule from "./pages/Rule";
import AdminEditRule from "./components/AdminEditRule";
import Contact from "./pages/Contact";
import ReportAnalytics from "./components/AdminAnalytics/ReportAnalytics";
import AccountAnalytics from "./components/AdminAnalytics/AccountAnalytics";


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkUserSession())
  }, [])

  return (
    <div className="App">
        {/* <AdminToolbar /> */}
        <Switch>
          {/* ====================HOME PAGE================== */}
          <Route exact path="/" render={() => (
            <HomepageLayout >
              <Homepage />
            </HomepageLayout>
          )} />

          <Route exact path=":filterType" render={() => (
            <HomepageLayout >
              <Homepage />
            </HomepageLayout>
          )} />

          {/* ====================SIGN IN PAGE================== */}
          <Route path="/login"
            render={() => (
              <MainLayout >
                <Login />
              </MainLayout>
            )}
          />

          {/* ====================SIGN UP PAGE================== */}
          <Route path="/registration"
            render={() => (
              <MainLayout >
                <Registration />
              </MainLayout>
            )}
          />

          {/* ====================SEARCH PAGE================== */}
          
          <Route exact path="/search"
            render={() => (
              <MainLayout >
                <Search />
              </MainLayout>
            )}
          />

          <Route exact path="/search/:searchTerm"
            render={() => (
              <MainLayout >
                <Search />
              </MainLayout>
            )}
          />

          {/* ====================RULE PAGE================== */}
          
          <Route exact path="/rule"
            render={() => (
              <MainLayout >
                <Rule />
              </MainLayout>
            )}
          />

          {/* ====================CONTACT PAGE================== */}
          
          <Route exact path="/contact"
            render={() => (
              <MainLayout >
                <Contact />
              </MainLayout>
            )}
          />

          {/* ====================UPLOAD VIDEO PAGE================== */}
          <Route path="/uploadvideo"
            render={() => (
              <WithAuth>
                <MainLayout >
                  <UploadVideo />
                </MainLayout>
              </WithAuth>
            )}
          />

          {/* ====================UPLOAD IMAGE PAGE================== */}
          <Route path="/uploadimage"
            render={() => (
              <WithAuth>
                <MainLayout >
                  <UploadImage />
                </MainLayout>
              </WithAuth>
            )}
          />

          {/* ====================VIDEOS PAGE================== */}
          <Route exact path="/videos"
            render={() => ( 
              <MainLayout >
                <Videos />
              </MainLayout>    
            )}
          />

          <Route exact path="/videos/:filterType"
            render={() => ( 
              <MainLayout >
                <Videos />
              </MainLayout>    
            )}
          />

          <Route exact path="/videos/tag/:filterTypeTag"
            render={() => ( 
              <MainLayout >
                <Videos />
              </MainLayout>    
            )}
          />

          {/* ====================IMAGES PAGE================== */}
          <Route exact path="/images"
            render={() => ( 
              <MainLayout >
                <Images />
              </MainLayout>    
            )}
          />

          <Route exact path="/images/:filterType"
            render={() => ( 
              <MainLayout >
                <Images />
              </MainLayout>    
            )}
          />

          <Route exact path="/images/tag/:filterTypeTag"
            render={() => ( 
              <MainLayout >
                <Images />
              </MainLayout>    
            )}
          />
          

          {/* ====================VIDEO DETIALS PAGE =================== */}
          <Route exact path="/video/:videoID" render={() => ( ///:videoID
            <VideoLayout>
              <Video />
            </VideoLayout>
          )}/>

          {/* ====================IMAGE DETIALS PAGE =================== */}
          <Route exact path="/image/:imageID" render={() => ( ///:videoID
            <ImageLayout>
              <Image />
            </ImageLayout>
          )}/>

          {/* ====================USER DETIALS PAGE =================== */}
          <Route exact path="/user/:userID" render={() => ( ///:videoID
            <UserLayout>
              <User />
            </UserLayout>
          )}/>

          {/* ====================USER DETIALS VIDEOS PAGE =================== */}
          <Route exact path="/user/videos/:userID" render={() => ( ///:videoID
            <UserLayout>
              <UserVideos />
            </UserLayout>
          )}/>

          {/* ====================USER DETIALS EDIT VIDEO PAGE =================== */}
          <Route exact path="/user/:userID/edit/:videoID" render={() => ( ///:videoID
            <WithAuth>
              <UserLayout>
                <UserEditVideo />
              </UserLayout>
            </WithAuth>
          )}/>

          {/* ====================USER DETIALS EDIT IMAGE PAGE =================== */}
          <Route exact path="/user/:userID/editImage/:imageID" render={() => ( ///:videoID
            <WithAuth>
              <UserLayout>
                <UserEditImage />
              </UserLayout>
            </WithAuth>
          )}/>

          {/* ====================USER DETIALS TIERS PAGE =================== */}
          <Route exact path="/user/tiers/:userID" render={() => ( ///:videoID
            <UserLayout>
              <UserTiers />
            </UserLayout>
          )}/>

          {/* ====================USER DETIALS IMAGES PAGE =================== */}
          <Route exact path="/user/images/:userID" render={() => ( ///:videoID
            <UserLayout>
              <UserImages />
            </UserLayout>
          )}/>

          {/* ====================USER DETIALS PRIVATE PAGE =================== */}
          <Route exact path="/user/private/:userID" render={() => ( ///:videoID
            <UserLayout>
              <UserPrivateContents />
            </UserLayout>
          )}/>

          {/* ====================USER DETIALS PRIVATE PAGE =================== */}
          <Route exact path="/user/liked/:userID" render={() => ( ///:videoID
            <UserLayout>
              <UserContentLiked />
            </UserLayout>
          )}/>

          {/* ====================USER DETIALS PRIVATE PAGE =================== */}
          <Route exact path="/user/saved/:userID" render={() => ( ///:videoID
            <UserLayout>
              <UserContentSaved />
            </UserLayout>
          )}/>

          {/* ==================== POINT PAGE =================== */}
          <Route exact path="/point/:userID" render={() => ( ///:videoID
            <MainLayout>
              <Point />
            </MainLayout>
          )}/>

          <Route exact path="/getPoint/:cost/:userID" render={() => ( ///:videoID
            <WithAuth>
              <MainLayout>
                <GetPoint />
              </MainLayout>
            </WithAuth>
          )}/>

          <Route exact path="/exchangePoint/:cost/:userID" render={() => ( ///:videoID
            <WithAuth>
              <MainLayout>
                <GetMoneyFromPoint />
              </MainLayout>
            </WithAuth>
          )}/>
          
          <Route exact path="/getPointSuccess/:results" render={() => ( ///:videoID
            <MainLayout>
              <SuccessPage />
            </MainLayout>
          )}/>

          {/* =================== ADMIN PAGE ========================= */}
          <Route exact path="/admin" render={() => (
            <WithAdminAuth>
              <AdminLayout>
                <Admin />
              </AdminLayout>
            </WithAdminAuth>
          )} />

          <Route exact path="/admin/categorys" render={() => (
            <WithAdminAuth>
              <AdminLayout>
                <AdminCategory />
              </AdminLayout>
            </WithAdminAuth>
          )} />

          <Route exact path="/admin/reports" render={() => (
            <WithAdminAuth>
              <AdminLayout>
                <AdminReport />
              </AdminLayout>
            </WithAdminAuth>
          )} />

          <Route exact path="/admin/reportLog" render={() => (
            <WithAdminAuth>
              <AdminLayout>
                <ReportAnalytics />
              </AdminLayout>
            </WithAdminAuth>
          )} />

          <Route exact path="/admin/accountLog" render={() => (
            <WithAdminAuth>
              <AdminLayout>
                <AccountAnalytics />
              </AdminLayout>
            </WithAdminAuth>
          )} />

          <Route exact path="/admin/accounts" render={() => (
            <WithAdminAuth>
              <AdminLayout>
                <AdminAccount />
              </AdminLayout>
            </WithAdminAuth>
          )} />

          <Route exact path="/admin/exchanges" render={() => (
            <WithAdminAuth>
              <AdminLayout>
                <AdminExchange />
              </AdminLayout>
            </WithAdminAuth>
          )} />

          <Route exact path="/admin/editRule" render={() => (
            <WithAdminAuth>
              <AdminLayout>
                <AdminEditRule />
              </AdminLayout>
            </WithAdminAuth>
          )} />

        </Switch>
    </div>
  );
}

export default App;
