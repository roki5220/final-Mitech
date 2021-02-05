//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.10;

contract Funding {
    //투자자 구조체
    struct Investor{
        address payable addr; //투자자의 어드레스
        uint amount;          //투자액
    }
    
    address payable public creator; // 컨트랙트 소유자   
    uint public numInvestors;    // 투자자수
    uint public deadline;         // 마감일(UnixTime)
    string public status;         // 모금활동 스테이터스
    bool public ended;            // 모금 종료여부
    uint public goalAmount;       // 목표액
    uint public totalAmount;      // 총 투자액
    mapping(uint => Investor) public investors; // 투자자 관리를 위한 매핑
   
    constructor(uint _duration, uint _goalAmount) public{
        creator = msg.sender;
        
        //마감일 설정
        deadline = now + _duration; 
        goalAmount = _goalAmount*1000000000000000000;
        status = "Funding";
        ended = false;
        numInvestors = 0;
        totalAmount = 0; 
    }
   // 투자 시에 호출되는 함수 
   function fund() public payable { 
       require(!ended);
       
       Investor storage inv = investors[numInvestors++];
       inv.addr = msg.sender; //투자자 주소
       inv.amount = msg.value;  //투자액
       totalAmount += inv.amount;
   }
   
   // 모금 성공/실패 여부에 따라 송금
   function checkGoalReached() public onlyOwner{ 
       //모금이 끝났다면 처리 중단
       require(!ended);
       
       //마감이 지나지 않았다면 처리 중단
       require(now >= deadline);
       
       if(totalAmount >= goalAmount){//모금 성공인 경우
           status = "Campaign Succeeded";
           ended = true;
           //컨트랙트 소유자에게 컨트랙트에 있는 모든 이더를 송금
           if(!creator.send(address(this).balance)){
               revert(); //throw
           }
       }else{ //모금 실패인 경우
           uint i = 0;
           status = "Campaign Failed";
           ended = true;
           
           //각 투자자에게 투자금을 돌려줌
           while(i<= numInvestors){
               if(!investors[i].addr.send(investors[i].amount)){
                   revert();
               }
               i++;
           }
       }
       
   }
   
   modifier onlyOwner() {
       require(msg.sender == creator);
       _;
   }

    // TODO Add functions

    function kill() public {
        if (msg.sender == creator) {
            selfdestruct(creator);
        }
    }
}