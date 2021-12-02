import React from "react"
export const InfoPage = () => {
    return (
        <div className="row">
            <div className="col s8 offset-s3" style={{paddingTop: '2rem'}}>

                <div className="card horizontal">
                    <div className="card-image" >
                        <img src={require("../images/infoPage_security.jpg")}/>
                    </div>
                    <div className="card-content">
                        <p>Это программа предназначена для хранения Ваших паролей.<br/><br/>
                            Подобных приложений существует великое множество, однако в конечном счете у пользователей возникает вопрос доверия к разработчику.<br/><br/>
                            Данное приложение создано для использования узким кругом лиц, непосредственно знакомым с автором и уверенных в его намерениях.</p>
                    </div>
                </div>
                <div className="card horizontal">
                <div className="card-content">

                    <p>Николаев Владимир Андреевич<br/></p>
                    <p><a href="mailto:nikolaev.vov2010@yandex.ru">nikolaev.vov2010@yandex.ru</a></p>
                </div>
                </div>

            </div>
        </div>
    )
}