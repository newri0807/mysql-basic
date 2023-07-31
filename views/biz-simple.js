
  function putLike (menu_id, like) {
    fetch(`/menus/${menu_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        like: like
      })
    }).then((response) => response.json()).then(
      (data) => {
        if (data[0].affectedRows === 1) {
          location.reload()
        } else {
          alert('오류가 발생했습니다.')
        }
      }
    )
  }

  function addRating () {
    fetch(`/ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        business_id: {{ biz.business_id }},
        stars: document.getElementById('stars').value,
        comment: document.getElementById('comment').value,
      })
    }).then((response) => response.json()).then(
      (data) => {
        console.log(data[0])
        if (data[0].affectedRows === 1) {
          location.reload()
        } else {
          alert('오류가 발생했습니다.')
        }
      }
    )
  }

  function removeRating (rating_id) {
    if (!confirm('이 평점을 삭제하시겠습니까?')) return

    fetch(`/ratings/${rating_id}`, {
      method: 'DELETE'
    }).then((response) => response.json()).then(
      (data) => {
        console.log(data[0])
        if (data[0].affectedRows === 1) {
          location.reload()
        } else {
          alert('오류가 발생했습니다.')
        }
      }
    )
  }