App = {
	web3Provider: null,

	contract: null,

	init: async function() { //화면

		return App.initWeb3();
	},

	initWeb3: async function() {
		//메타마스크 프로바이더 연결
		if (window.ethereum) { // infura
			App.web3Provider = window.ethereum;
			try {
				await window.ethereum.enable();
			} catch (error) {
				console.error("Used denied account access");
			}
		} else if (window.web3) { // 브라우저에 주입된 Mist 나 MetaMask 프로바이더 사용여부 확인
			App.web3Provider = window.web3.currentProvider;
		} else {
			App.web3Provider = new Web3.providers.HttpProvider("http://192.168.0.36:7545");
		}

		web3 = new Web3(App.web3Provider);

		return await App.initContract();
	},

	initContract: function() { //abi 
		//컨트랙트 생성
		App.contract = new web3.eth.Contract(abi);
		App.contract.options.address = "0x4BE2c8Be2F3f1A2907356BF65810B10b7aCfC8dB";

		App.joinButtonEvents(); //펀딩 참여 버튼 누르는 이벤트


	}, //컨트랙트 연결

	joinButtonEvents: function() { //펀딩 참여 버튼 누르는 이벤트
		$("#joinbutton").on('click', App.setFund);
	},
	setting: function(fundingId, fundingDate, fundingGoal) {
		
		web3.eth.getAccounts(function(error, accounts) {
			let account = accounts[0];
			App.contract.methods.setting(fundingId, fundingDate, fundingGoal)
				.send({ from: account, value: 0 })
				.then(function(result) {
					$.ajax({
						url: "conditionUpdate.a",
						data: { //파라미터 이름: 실제값
							fundingId: fundingId,
							fundingCondition: '펀딩중'
						},
						success: function(result) { //성공하면 실행할 콜백 함수 
							if (result == "SUCCESS") {
								alert("펀딩이 시작 되었습니다. 펀딩 중으로 상태가 변경되었습니다.");
							} else {
								alert("처리 실패!");
							}

							location.href = "/etoile/admin/fundingComingSoonList.a";
						}
					});
					
				})

		})


	},
	setFund: function() {
		//login체크
		if (memberid == '') {
			location.href = "/etoile/site/loginForm";
			return;
		}


		var price = $('#blockPrice').val();

		var fundingId = $('#fundingId').val();
		var fundingPrice = $('#blockPrice').val();
		var fundingGift = $('#fundingGift').val();

		var fundingTotalprice = parseInt($('#fundingTotalprice').html()) + parseInt(price); //fundingSelect의 name값 속성
		
		var fromWeiValue =  web3.utils.fromWei(price, 'wei');
		console.log(fromWeiValue);
		web3.eth.getAccounts(function(error, accounts) {

			if (error) {
				consolt.log(error);
				return;
			}
			var account = accounts[0]; //메타마스크 첫번째 계정 계좌 찾아옴

			App.contract.methods
				.fund(fundingId)
				.send({
					from: account,
					value: fromWeiValue
				}) //send로 호출할때는 account
				.then(function(result) {
					alert('펀딩에 참여되었습니다');
				})
				.then(function(result) {
					$.ajax({
						url: "fundingJoinInsert.do",
						data: { //파라미터 이름: 실제값
							fundingId: fundingId,
							fundingPrice: fundingPrice,
							fundingGift: fundingGift,
							fundingTotalprice: fundingTotalprice
						},
						success: function(result) { //성공하면 실행할 콜백 함수 
							location.href = "/etoile/site/fundingSelect?fundingId=" + fundingId;

						}
					});
				})

		})
	},
	fundingResult: function(fundingId) {
		web3.eth.getAccounts(function(error, accounts) {
			let account = accounts[0];
			App.contract.methods.checkGoalReached(fundingId)
				.send({ from: account, value: 0 })
				.then(function(result) {
					console.log(fundingId);
					console.log(result);
				})
				.then(function(result) {
					$.ajax({
						url: "conditionUpdate.a",
						data: { //파라미터 이름: 실제값
							fundingId: fundingId,
							fundingCondition: '펀딩마감'
						},
						success: function(result) { //성공하면 실행할 콜백 함수 
							if (result == "SUCCESS") {
								alert("펀딩이 성공적으로 환불되었습니다! 펀딩 환불 마감 처리 되었습니다.");
							} else {
								alert("환불 마감 처리 실패!");
							}

							location.href = "/etoile/admin/fundingOpenList.a";
						}
					});
				});
		})
	}
}


$(function() {
	App.init();
});