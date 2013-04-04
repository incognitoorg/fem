package com.fem.google.cloud.endpoints;

import java.util.ArrayList;

import javax.jdo.annotations.Element;
import javax.jdo.annotations.Extension;
import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class Group {

	
	@PrimaryKey
    @Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
    @Extension(vendorName="datanucleus", key="gae.encoded-pk", value="true")
    private String groupId;

	private String groupName;
	private String groupType;
	private String groupOwnerId;
	

	/*@Persistent(embeddedElement = "true", defaultFetchGroup = "true")
	@Element(embedded="userId")*/
	private ArrayList<User> members;
	
	private ArrayList<String> membersIdList;
	
	
	
	
	
	public String getGroupName() {
		return groupName;
	}
	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}
	public String getGroupType() {
		return groupType;
	}
	public void setGroupType(String groupType) {
		this.groupType = groupType;
	}
	public String getGroupOwerId() {
		return groupOwnerId;
	}
	public void setGroupOwerId(String groupOwnerId) {
		this.groupOwnerId = groupOwnerId;
	}
	public ArrayList<User> getMembers() {
		return members;
	}
	public void setMembers(ArrayList<User> members) {
		this.members = members;
	}
	public String getGroupId() {
		return groupId;
	}
	public void setGroupId(String groupId) {
		this.groupId = groupId;
	}
	
	public ArrayList<String> getMembersIdList() {
		return membersIdList;
	}
	public void setMembersIdList(ArrayList<String> membersIdList) {
		this.membersIdList = membersIdList;
	}
	
	

	
	
	
}
