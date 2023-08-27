class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
  }

  _checkStatus(res) {
    return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
  }

  _request(endUrl, options) {
    return fetch(`${this._baseUrl}${endUrl}`, options).then(this._checkStatus);
  }

  getInitialCards(token) {
    return this._request(`/cards`, {
      headers: {
          "Authorization": `Bearer ${token}`
      },
    });
  }

  addNewCard(data, token) {
    return this._request(`/cards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        name: data.name,
        link: data.link,
      }),
    });
  }

  deleteCard(cardId, token) {
    return this._request(`/cards/${cardId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  }

  getUserInfo(token) {
    return this._request(`/users/me`, {
      headers: {
        "Authorization": `Bearer ${token}`
      },
    });
  }

  setUserInfo(data, token) {
    return this._request(`/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        name: data.heading,
        about: data.subheading,
      }),
    });
  }

  setUserAvatar(data, token) {
    return this._request(`/users/me/avatar`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        avatar: data.link,
      }),
    });
  }

  handlerLikeCard(cardId, token) {
    return this._request(`/cards/${cardId}/likes`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  }

  deleteLikeCard(cardId, token) {
    return this._request(`/cards/${cardId}/likes`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  }

  changeLikeCardStatus(cardId, noLiked, token) {
    return noLiked ? this.handlerLikeCard(cardId, token) : this.deleteLikeCard(cardId, token);
  }
}

export const api = new Api({
  baseUrl: "https://pershinkirillvm.nomoredomainsicu.ru",
});
